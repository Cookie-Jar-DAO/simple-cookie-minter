import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const FeedJarSchema = z.object({
  amount: z.string().refine(
    (value) => {
      // Ensure the value is a positive number
      try {
        const amount = parseFloat(value);
        return amount > 0;
      } catch {
        return false;
      }
    },
    {
      message: "Amount must be a positive number",
    },
  ),
});

const FeedJarForm = ({
  sendTokens,
}: {
  sendTokens: (data: z.infer<typeof FeedJarSchema>) => void;
}) => {
  const form = useForm<z.infer<typeof FeedJarSchema>>({
    resolver: zodResolver(FeedJarSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(sendTokens)} className="space-y-6">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter amount..." {...field} />
              </FormControl>
              <FormDescription>
                The ERC20 or native token used for cookies
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default FeedJarForm;
