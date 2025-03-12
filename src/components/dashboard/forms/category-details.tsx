'use client';

import { Category } from '@prisma/client';
import { FC, useEffect } from 'react';

interface CategoryDetailsProps {
  category?: Category;
}

// form handling utils
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoryFormSchema } from '@/lib/schemas';

import { AlertDialog } from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
const CategoryDetails: FC<CategoryDetailsProps> = ({ category }) => {
  // form hook for managing form state and validation
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    mode: 'onChange', // form validation mode
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: category?.name || '',
      image: category?.image ? [{ url: category.image }] : [],
      url: category?.url || '',
      featured: category?.featured || false,
    },
  });
  const isLoading = form.formState.isSubmitting;

  // reset form values when data changes
  useEffect(() => {
    if (category) {
      form.reset({
        name: category?.name,
        image: category?.image ? [{ url: category.image }] : [],
        url: category?.url,
        featured: category?.featured,
      });
    }
  }, [category, form]);

  // submit handler
  const onSubmit = async (data: z.infer<typeof CategoryFormSchema>) => {
    console.log(data);
  };

  return (
    <AlertDialog>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {category?.id
              ? `Update ${category.name} category information`
              : 'Create a new category, you can edit it later from the categories table or the categories tab'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
              <FormField
                disabled={isLoading}
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Category Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Category name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name='url'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Category URL</FormLabel>
                    <FormControl>
                      <Input placeholder='/category-url' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name='featured'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Featured Category</FormLabel>
                      <FormDescription>
                        Featured categories will be displayed on the homepage
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <Button type='submit' disabled={isLoading}>
                {isLoading
                  ? 'loading...'
                  : category?.id
                    ? 'Save category information'
                    : 'Create category'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CategoryDetails;
