// Category Form Schema
import * as z from 'zod';

export const CategoryFormSchema = z.object({
  name: z
    .string({
      required_error: 'Category name is required',
      invalid_type_error: 'Category name must be a string',
    })
    .min(2, {
      message: 'Category name must be at least 2 characters long',
    })
    .max(50, {
      message: 'Category name must be less than 50 characters long',
    })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: 'Category name must contain only letters, numbers and spaces',
    }),
  image: z
    .object({
      url: z.string(),
    })
    .array()
    .length(1, 'Choose only one category image'),

  url: z
    .string({
      required_error: 'Category URL is required',
      invalid_type_error: 'Category URL must be a string',
    })
    .min(2, {
      message: 'Category URL must be at least 2 characters long',
    })
    .max(50, {
      message: 'Category URL must be less than 50 characters long',
    })
    .regex(/^(?!.*[-_]{2})[a-zA-Z0-9-_]+$/, {
      message:
        'Category URL must contain only letters, numbers, hyphens and underscores. Consecutive hyphens or underscores are not allowed',
    }),
  featured: z.boolean().default(false),
});
