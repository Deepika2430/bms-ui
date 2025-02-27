import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

const clientSchema = z.object({
  // Client Information
  companyName: z.string().min(1, "Company name is required"),
  clientType: z.string().min(1, "Client type is required"),
  panNumber: z.string().min(1, "PAN/Federal Tax ID is required"),
  isActive: z.boolean(),

  // Mailing Address
  contactPerson: z.string().min(1, "Contact person is required"),
  mailingCountry: z.string().min(1, "Country is required"),
  mailingStreet: z.string().min(1, "Street is required"),
  mailingCity: z.string().min(1, "City is required"),
  mailingState: z.string().min(1, "State is required"),
  mailingZipCode: z.string().min(1, "Zip code is required"),
  mailingPhone: z.string().optional(),
  mailingMobile: z.string().optional(),
  mailingFax: z.string().optional(),
  mailingEmail: z.string().email("Invalid email address"),

  // Billing Address
  sameAsMailing: z.boolean(),
  billingAttention: z.string().optional(),
  billingCountry: z.string().optional(),
  billingStreet: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingZipCode: z.string().optional(),
  billingPhone: z.string().optional(),
  billingMobile: z.string().optional(),
  billingFax: z.string().optional(),
  billingEmail: z.string().email("Invalid email address").optional(),
});

interface ClientFormProps {
  onSubmit: (data: z.infer<typeof clientSchema>) => void;
  onCancel: () => void;
  initialData?: any;
}

const ClientForm = ({ onSubmit, onCancel, initialData }: ClientFormProps) => {
  const form = useForm<z.infer<typeof clientSchema>>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      isActive: initialData?.isActive ?? true,
      sameAsMailing: initialData?.sameAsMailing ?? false,
      companyName: initialData?.companyName ?? "",
      clientType: initialData?.clientType ?? "",
      panNumber: initialData?.panNumber ?? "",
      contactPerson: initialData?.contactPerson ?? "",
      mailingCountry: initialData?.mailingCountry ?? "",
      mailingStreet: initialData?.mailingStreet ?? "",
      mailingCity: initialData?.mailingCity ?? "",
      mailingState: initialData?.mailingState ?? "",
      mailingZipCode: initialData?.mailingZipCode ?? "",
      mailingPhone: initialData?.mailingPhone ?? "",
      mailingMobile: initialData?.mailingMobile ?? "",
      mailingFax: initialData?.mailingFax ?? "",
      mailingEmail: initialData?.mailingEmail ?? "",
      billingAttention: initialData?.billingAttention ?? "",
      billingCountry: initialData?.billingCountry ?? "",
      billingStreet: initialData?.billingStreet ?? "",
      billingCity: initialData?.billingCity ?? "",
      billingState: initialData?.billingState ?? "",
      billingZipCode: initialData?.billingZipCode ?? "",
      billingPhone: initialData?.billingPhone ?? "",
      billingMobile: initialData?.billingMobile ?? "",
      billingFax: initialData?.billingFax ?? "",
      billingEmail: initialData?.billingEmail ?? "",
    },
  });

  const [isClientInfoOpen, setIsClientInfoOpen] = useState(true);
  const [isMailingInfoOpen, setIsMailingInfoOpen] = useState(true);
  const [isBillingInfoOpen, setIsBillingInfoOpen] = useState(true);

  const { watch } = form;
  const sameAsMailing = watch("sameAsMailing");
  const mailingAddress = watch([
    "mailingCountry",
    "mailingStreet",
    "mailingCity",
    "mailingState",
    "mailingZipCode",
    "mailingPhone",
    "mailingMobile",
    "mailingFax",
    "mailingEmail",
  ]);

  useEffect(() => {
    if (sameAsMailing) {
      form.setValue("billingCountry", mailingAddress[0]);
      form.setValue("billingStreet", mailingAddress[1]);
      form.setValue("billingCity", mailingAddress[2]);
      form.setValue("billingState", mailingAddress[3]);
      form.setValue("billingZipCode", mailingAddress[4]);
      form.setValue("billingPhone", mailingAddress[5]);
      form.setValue("billingMobile", mailingAddress[6]);
      form.setValue("billingFax", mailingAddress[7]);
      form.setValue("billingEmail", mailingAddress[8]);
    }
  }, [sameAsMailing, mailingAddress, form]);

  return (
    <Card className="border-none shadow-none p-0">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="border rounded-lg shadow-md">
              <div
                className={`flex justify-between items-center cursor-pointer ${isClientInfoOpen ? "pb-0 px-3 pt-3" : "p-3"}`}
                onClick={() => setIsClientInfoOpen(!isClientInfoOpen)}
              >
                <h2 className="text-lg font-semibold">Client Information</h2>
                {isClientInfoOpen ? <ChevronUp /> : <ChevronDown />}
              </div>
              {isClientInfoOpen && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="clientType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Type*</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Client Type..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="corporate">Corporate</SelectItem>
                              <SelectItem value="individual">Individual</SelectItem>
                              <SelectItem value="government">Government</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="panNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PAN/Federal Tax ID*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-8">
                          <FormLabel>Status: </FormLabel>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel>Is Active</FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="border rounded-lg shadow-md">
              <div
                className={` flex justify-between items-center p-4 cursor-pointer ${isMailingInfoOpen ? "pb-0 px-3 pt-3" : "p-3"}`}
                onClick={() => setIsMailingInfoOpen(!isMailingInfoOpen)}
              >
                <h2 className="text-lg font-semibold">Mailing Address</h2>
                {isMailingInfoOpen ? <ChevronUp /> : <ChevronDown />}
              </div>
              {isMailingInfoOpen && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    <FormField
                      control={form.control}
                      name="contactPerson"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Person*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mailingCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mailingStreet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mailingCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mailingState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mailingZipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code*</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mailingPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Office)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mailingMobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Mobile)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mailingFax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fax</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mailingEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email*</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="border rounded-lg shadow-md">
              <div
                className={`flex justify-between items-center p-4 cursor-pointer ${isBillingInfoOpen ? "pb-0 px-3 pt-3" : "p-3"}`}
                onClick={() => setIsBillingInfoOpen(!isBillingInfoOpen)}
              >
                <h2 className="text-lg font-semibold">Billing Address</h2>
                {isBillingInfoOpen ? <ChevronUp /> : <ChevronDown />}
              </div>
              {isBillingInfoOpen && (
                <div className="p-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="sameAsMailing"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Same as Mailing Address</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    <FormField
                      control={form.control}
                      name="billingAttention"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Attention</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={sameAsMailing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingCountry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={sameAsMailing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingStreet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={sameAsMailing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={sameAsMailing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={sameAsMailing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingZipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Zip Code</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={sameAsMailing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Office)</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={sameAsMailing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingMobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (Mobile)</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={sameAsMailing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingFax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fax</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={sameAsMailing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="billingEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" disabled={sameAsMailing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" className="bg-nav-accent text-white">
                {initialData ? "Update Client" : "Save Client"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ClientForm;
