import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { clerkClient, WebhookEvent } from '@clerk/nextjs/server';

import { User } from '@prisma/client';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env',
    );
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET);

  // Get headers
  const headersList = await headers();
  const svix_id = headersList.get('svix-id');
  const svix_timestamp = headersList.get('svix-timestamp');
  const svix_signature = headersList.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  let evt: WebhookEvent;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error: Could not verify webhook:', err);
    return new Response('Error: Verification error', {
      status: 400,
    });
  }

  // Do something with payload
  // For this guide, log payload to console

  const eventType = evt.type;

  // When user is created or updated, update user in database
  if (eventType === 'user.created' || eventType === 'user.updated') {
    const data = JSON.parse(body).data;
    const user: Partial<User> = {
      id: data.id,
      name: `${data.first_name} ${data.last_name}`,
      email: data.email_addresses[0].email_address,
      picture: data.image_url,
    };
    if (!user) return;

    // Update user in database
    const dbUser = await db.user.upsert({
      where: {
        email: user.email,
      },
      update: user,
      create: {
        id: user.id,
        name: user.name!,
        email: user.email!,
        picture: user.picture!,
        role: user.role || 'USER',
      },
    });

    // Update user metadata in Clerk
    await clerkClient.users.updateUserMetadata(data.id, {
      privateMetadata: {
        role: dbUser.role || 'USER', // Default role to "USER" if not present in dbUser
      },
    });
  }

  // When user is deleted, delete user from database
  if (eventType === 'user.deleted') {
    const data = JSON.parse(body).data;
    if (!data) return;

    // Delete user from database
    await db.user.delete({
      where: {
        id: data.id,
      },
    });
  }

  return new Response('Webhook received', { status: 200 });
}
