import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addEmailSender } from "@/apis";
import toast from "react-hot-toast";

type FormValues = {
  provider: string;
  name: string;
  // username: string;
  email: string;
  password: string;
  host: string;
  port: string;
};

type EmailConfigFormProps = {
  setOpen: (open: boolean) => void;
  handleAddSender: (data: any) => void;
};

export function EmailConfigForm({
  setOpen,
  handleAddSender,
}: EmailConfigFormProps) {
  const form = useForm<FormValues>({
    defaultValues: {
      provider: "google",
      name: "John Doe",
      // senderUsername: "email@company.net",
      email: "email@company.net",
      password: "",
      host: "smtp.gmail.com",
      port: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: FormValues) {
    const data = await addEmailSender(values);

    if (!data.success) {
      toast.error(data.message);
    } else {
      toast.success(data.message);
      handleAddSender(data.data);
      setOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-md"
      >
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select email service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="outlook">Outlook</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="senderUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sender Username (SMTP)</FormLabel>
              <FormControl>
                <Input placeholder="email@company.net" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="email"
          rules={{
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sender Email Address (SMTP)</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@company.net"
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>App Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="host"
          rules={{
            required: "Host is required",
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>SMTP Host (Outgoing Server)</FormLabel>
              <FormControl>
                <Input placeholder="smtp.gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="port"
          rules={{
            required: "Port is required",
            minLength: {
              value: 3,
              message: "Port must be at least 3 digits",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>SMTP Port (Outgoing Server Port)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 465 or 587" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Connect Email"}
        </Button>
      </form>
    </Form>
  );
}
