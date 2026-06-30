import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnui/card";
import ChangeEmailForm from "@/components/User/ChangeEmailForm";
import ChangeNameForm from "@/components/User/ChangeNameForm";
import ChangePasswordForm from "@/components/User/ChangePasswordForm";
import DeleteAccountForm from "@/components/User/DeleteAccountForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const SettingsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentName = session?.user.name ?? "";
  const currentEmail = session?.user.email ?? "";

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">
          Update your account details and security settings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your display name and email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Name</h2>
              <ChangeNameForm currentName={currentName} />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Email</h2>
              <ChangeEmailForm currentEmail={currentEmail} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Change your password or delete your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Change password</h2>
              <ChangePasswordForm />
            </div>

            <div className="space-y-2">
              <h2 className="text-destructive text-lg font-semibold">
                Delete account
              </h2>
              <p className="text-muted-foreground text-sm">
                This action is permanent and requires your password.
              </p>
              <DeleteAccountForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default SettingsPage;
