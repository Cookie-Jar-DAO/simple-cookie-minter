import { UseFormReturn } from "react-hook-form";
import { CookieJarFormKeys, CookieJarFormValues } from "./multi-step-jar-form";
import { Progress } from "../ui/progress";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRightIcon, ArrowLeftIcon, Link, FormInput } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useAccount } from "wagmi";
import ConnectButton from "../connect-button";
import { Checkbox } from "../ui/checkbox";

interface JarFormStepsProps {
  form: UseFormReturn<CookieJarFormValues>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const cookieJarFormSteps = new Map([
  [
    1,
    {
      title: "Select Jar",
      description:
        "Start by picking out a jar to hold cookies. There are several types of jars to choose from and you'll use this again later when you pick a cookie monster to keep the cookies safe.",
      fields: ["jarType", "jarName", "jarDescription", "jarLink"],
    },
  ],
  [
    2,
    {
      title: "Cookie Recipe",
      description:
        "Break out the apron. It's time to make cookies for the new jar! Every cookie can be different so think about what you want to offer. You'll need to choose the token you want to give out, the amount of tokens baked into each cookie, and how long people need to wait until they can grab another tasty treat.",
      fields: ["cookiePeriod", "cookieAmount", "cookieToken", "donationAmount"],
    },
  ],
  [
    3,
    {
      title: "Cookie Monster!",
      description:
        "Every CookieJar needs a Cookie Monster! Someone to protect the cookie jar from the cookie thieves. Here you'll configure the gating mechanism to be used to make sure only the right people can get cookies.",
      fields: ["hatId"] || ["erc20Token", "erc20Threshold"] || [
          "erc721Token",
          "erc721Threshold",
        ] || ["baalDao", "baalThreshold", "baalUseLoot", "baalUseShares"],
    },
  ],
  [
    4,
    {
      title: "Review Jar",
      description:
        "Wow, we've got a shiny new jar ready to be filled with cookies!Take a look at your jar, cookies, cookie monster and make sure everything looks good. If you're ready, we can get these in the oven and you'll have cookies in no time!",
      fields: ["donationAmount"],
    },
  ],
]);

const JarFormSteps = ({
  form,
  currentStep,
  setCurrentStep,
}: JarFormStepsProps) => {
  const { address } = useAccount();
  const isLastStep = currentStep === cookieJarFormSteps.size;

  const handleNextClick = () => {
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="">
      <div className="">
        <Progress value={(currentStep / 4) * 100} className="h-2" />
        <h2>{cookieJarFormSteps.get(currentStep)?.title}</h2>
      </div>
      {currentStep === 1 && <SelectJar form={form} />}
      {currentStep === 2 && <CookieRecipe form={form} />}
      {currentStep === 3 && <CookieMonster form={form} />}
      {currentStep === 4 && <ReviewAndDonate form={form} />}
      <div className="relative flex items-center justify-between py-3">
        <Button
          onClick={() => setCurrentStep(currentStep - 1)}
          className={currentStep === 1 ? "hidden" : ""}
          variant={"outline"}
          type="button"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Previous
        </Button>
        {/* <Button onClick={reset} type="button">
          <Trash2Icon className="w-4 h-4 mr-2" />
          Reset
        </Button> */}
        {!isLastStep && (
          <Button onClick={handleNextClick} type="button">
            Next
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
        {isLastStep && address && (
          <Button type="submit">
            <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
        {isLastStep && !address && <ConnectButton />}
      </div>
    </div>
  );
};

const SelectJar = ({ form }: { form: UseFormReturn<CookieJarFormValues> }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="cookieJar"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>CookieJar</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a CookieJar" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="ERC20CookieJar6551">
                  Token Gated CookieJar
                </SelectItem>
                <SelectItem value="ERC721CookieJar6551">
                  NFT Gated CookieJar
                </SelectItem>
                <SelectItem value="BaalCookieJar6551">
                  Baal Gated CookieJar
                </SelectItem>
                <SelectItem value="HatsCookieJar6551">
                  Hats Gated CookieJar
                </SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              You can learn more about the types of CookieJars
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="jarName"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>Jar Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>Give your jar a name</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="jarDescription"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>Jar Name</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormDescription>
              Describe what this jar should be used for
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="jarLink"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>Jar Link</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              Please provide a link to relevant information about this effort
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const CookieRecipe = ({
  form,
}: {
  form: UseFormReturn<CookieJarFormValues>;
}) => {
  return (
    <>
      <FormField
        control={form.control}
        name="cookieToken"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>Cookie Token</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormDescription>
              Choose the token to be used as a cookie
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cookieAmount"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>Cookie Amount</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ? field.value.toString() : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? "" : BigInt(value));
                }}
              />
            </FormControl>
            <FormDescription>
              Choose the amount of tokens to be given out as a cookie
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="cookiePeriod"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>Cooling Period</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value ? field.value.toString() : ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? "" : BigInt(value));
                }}
              />
            </FormControl>
            <FormDescription>
              Cookies are hot! You can&apos;t have people grabbing cookies
              nonstop! Choose the amount of time between when a user can reach
              in the cookie jar.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const CookieMonster = ({
  form,
}: {
  form: UseFormReturn<CookieJarFormValues>;
}) => {
  const jarType = form.watch("cookieJar");
  return (
    <>
      {jarType === "ERC20CookieJar6551" && (
        <>
          <FormField
            control={form.control}
            name="erc20Token"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>ERC20 Token</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Choose the token to be used as a gating mechanism
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="erc20Threshold"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>ERC20 Threshold</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ? field.value.toString() : ""}
                  />
                </FormControl>
                <FormDescription>
                  Choose the threshold, the number of the ERC20 token a user
                  must hold to reach in the jar.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
      {jarType === "ERC721CookieJar6551" && (
        <>
          <FormField
            control={form.control}
            name="erc721Token"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>ERC20 Token</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Choose the NFT to be used as a gating mechanism
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="erc721Threshold"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>ERC20 Threshold</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ? field.value.toString() : ""}
                  />
                </FormControl>
                <FormDescription>
                  Choose the threshold, the number of the NFTs a user must hold
                  to reach in the jar.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
      {jarType === "BaalCookieJar6551" && (
        <>
          <FormField
            control={form.control}
            name="baalDao"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>DAO Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Paste the address of the DAO to be used as a gating mechanism.
                  This must be a Moloch DAO.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="baalThreshold"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>DAO Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ? field.value.toString() : ""}
                  />
                </FormControl>
                <FormDescription>
                  Paste the address of the DAO to be used as a gating mechanism.
                  This must be a Moloch DAO.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="baalUseShares"
            render={({ field }) => (
              <FormItem className="col-span-full flex flex-row items-start space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange(true)
                        : field.onChange(false);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Use Shares</FormLabel>
                  <FormDescription>
                    Use shares to gate cookie withdrawals
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="baalUseLoot"
            render={({ field }) => (
              <FormItem className="col-span-full flex flex-row items-start space-x-3 space-y-0 p-4">
                <FormControl>
                  <Checkbox
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange(true)
                        : field.onChange(false);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Use Loot</FormLabel>

                  <FormDescription>
                    Use loot to gate cookie withdrawals
                  </FormDescription>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
      {jarType === "HatsCookieJar6551" && (
        <>
          <FormField
            control={form.control}
            name="hatId"
            render={({ field }) => (
              <FormItem className="col-span-full">
                <FormLabel>Hat ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Paste the Hats Id to be used as a your cookie monster
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </>
  );
};

const ReviewAndDonate = ({
  form,
}: {
  form: UseFormReturn<CookieJarFormValues>;
}) => {
  const formValues = form.getValues();
  const jarType = formValues.cookieJar;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Jar Details</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>Jar Type:</div>
        <div>{formValues.cookieJar}</div>
        <div>Jar Name:</div>
        <div>{formValues.jarName}</div>
        <div>Jar Description:</div>
        <div>{formValues.jarDescription}</div>
        <div>Jar Link:</div>
        <div>{formValues.jarLink}</div>
      </div>

      <h3 className="text-lg font-semibold">Cookie Recipe</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>Cookie Token:</div>
        <div>{formValues.cookieToken}</div>
        <div>Cookie Amount:</div>
        <div>{formValues.cookieAmount?.toString()}</div>
        <div>Cookie Period:</div>
        <div>{formValues.cookiePeriod?.toString()}</div>
      </div>

      <h3 className="text-lg font-semibold">Cookie Monster</h3>
      <div className="grid grid-cols-2 gap-2">
        {jarType === "ERC20CookieJar6551" && (
          <>
            <div>ERC20 Token:</div>
            <div>{formValues.erc20Token}</div>
            <div>ERC20 Threshold:</div>
            <div>{formValues.erc20Threshold?.toString()}</div>
          </>
        )}
        {jarType === "ERC721CookieJar6551" && (
          <>
            <div>ERC721 Token:</div>
            <div>{formValues.erc721Token}</div>
            <div>ERC721 Threshold:</div>
            <div>{formValues.erc721Threshold?.toString()}</div>
          </>
        )}
        {jarType === "BaalCookieJar6551" && (
          <>
            <div>DAO Address:</div>
            <div>{formValues.baalDao}</div>
            <div>DAO Threshold:</div>
            <div>{formValues.baalThreshold?.toString()}</div>
            <div>Use Shares:</div>
            <div>{formValues.baalUseShares ? "Yes" : "No"}</div>
            <div>Use Loot:</div>
            <div>{formValues.baalUseLoot ? "Yes" : "No"}</div>
          </>
        )}
        {jarType === "HatsCookieJar6551" && (
          <>
            <div>Hat ID:</div>
            <div>{formValues.hatId}</div>
          </>
        )}
      </div>
      <p>
        CookieJar is a free tool made by a group of awesome people. If you would
        like to send a few cookies our way it will help us develop new features
        and support other ways of configuring CookieJars
      </p>
      <FormField
        control={form.control}
        name="donationAmount"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>Donation Amount</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="number"
                placeholder="Enter donation amount"
              />
            </FormControl>
            <FormDescription>
              Enter the amount you&apos;d like to donate to this CookieJar
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default JarFormSteps;
