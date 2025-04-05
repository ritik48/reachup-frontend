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
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createWorkflow, fetchConnectedEmails } from "@/apis"; // Assuming you have an API function to fetch providers
import { useNavigate } from "react-router-dom";

type Provider = {
  _id: string;
  name: string;
};

type FormValues = {
  providerId: string;
  name: string;
};

type WorkflowConfigFormProps = {
  setOpen: (open: boolean) => void;
};

export function WorkflowConfigForm({ setOpen }: WorkflowConfigFormProps) {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      providerId: "",
      name: "",
    },
  });

  // Fetch providers on component mount
  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoadingProviders(true);
      try {
        const data = await fetchConnectedEmails();
        if (!data.success) {
          setProviders([]);
        }
        setProviders(data.data);
      } catch (error) {
        toast.error("Error fetching providers");
      } finally {
        setIsLoadingProviders(false);
      }
    };

    fetchProviders();
  }, []);

  const isSubmitting = form.formState.isSubmitting;
  const navigate = useNavigate();

  async function onSubmit(values: FormValues) {
    if (!values.providerId) {
      toast.error("Please select a provider");
      return;
    }

    try {
      const selectedProvider = providers.find(
        (p) => p._id === values.providerId
      );
      if (!selectedProvider) {
        toast.error("Selected provider not found");
        return;
      }

      const data = await createWorkflow(values.name, values.providerId);

      if (!data.success) {
        toast.error(data.message);
      } else {
        toast.success(data.message);

        navigate(`/workflow/${data.data._id}`);
        setOpen(false);
      }
    } catch (error) {
      toast.error("Failed to create workflow");
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
          name="providerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Provider</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoadingProviders}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingProviders
                          ? "Loading providers..."
                          : "Select provider"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider._id} value={provider._id}>
                      {provider.name}
                    </SelectItem>
                  ))}
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
              <FormLabel>Workflow name</FormLabel>
              <FormControl>
                <Input placeholder="My email workflow" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isLoadingProviders}
        >
          {isSubmitting ? "Creating workflow..." : "Create Workflow"}
        </Button>
      </form>
    </Form>
  );
}
