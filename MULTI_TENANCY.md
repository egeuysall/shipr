# Multi-tenant architecture

There are several ways to model how users and Organizations fit into your application. The 3 scenarios that will be covered in this guide are:

1. B2C: Business to Consumer
2. B2B: Business to Business
3. Platforms

We will share some of the common characteristics of apps in each scenario as well as the level of support for these features in Clerk.

## B2C: Business to Consumer

B2C companies focus on selling products or services directly to consumers. Some popular examples are Netflix, Headspace, and Spotify. Clerk supports the B2C user management model out-of-the-box, with little-to-no configuration.

In a B2C scenario, applications generally share the following characteristics:

- A user creates a single account with your service
- There is a single, shared user-pool which all the users belong to
- Any connections enabled for your application are available to all users to authenticate with
- The application branding is that of your company (as in, not white-labelled per customer or organization)
- The application is accessible under a single domain (for example: `example.com` or `app.example.com`)

> In the B2C scenario, Organizations are generally not necessary since users that sign up to your application typically do not exist as part of a team, organization, or workspace.

## B2B: Business to Business

B2B companies sell to other businesses. Some examples include: GitHub, Vercel, Salesforce, Sentry, and Clerk.

In the B2B model, multi-tenant SaaS applications generally leverage organizations (sometimes called teams or workspaces) to manage users and their memberships. This approach allows for control over what resources users have access to across different organizations based on their Roles.

Oftentimes such applications will also allow users to create Personal Accounts that are separate from other organizations. For example, GitHub allows users to create repositories under their own Personal Account or an organization they are part of.

The user pool for multi-tenant, SaaS applications will generally fall into one of two categories:

1. **Shared user-pool**: the application has a single pool of users. A user can create one account and belong to multiple organizations. The user can have separate Roles in each Organization.
2. **Isolated user-pool**: each organization has its own pool of users. A user must create a separate account for each organization.

> Clerk supports the **shared user-pool** model for B2B scenarios which will be discussed in this section. The **isolated user-pool** model is more relevant in the Platforms scenario which will be discussed in the next section.

B2B SaaS applications with the following characteristics are well-supported with Clerk:

- A single application deployment that serves multiple business customers (multi-tenant)
- A shared user-pool model where a user can log in with a single account and belong to multiple organizations
- Enabled connections can be available to all users or linked to specific organizations
- The application may carry your own branding or some elements of your customer's branding
- The application is served from a single domain (for example: `app.example.com`)

### Integrating Organizations with your application

Clerk offers a number of building blocks to help integrate Organizations into your application:

- The [`<OrganizationSwitcher /> component`](https://clerk.com/docs/nextjs/reference/components/organization/organization-switcher.md) provides a way for your users to select which Organization is the Active Organization. The [`useOrganizationList()` hook](https://clerk.com/docs/guides/development/custom-flows/organizations/organization-switcher.md) can be used for more control.
- The [`useOrganization() hook`](https://clerk.com/docs/nextjs/reference/hooks/use-organization.md) can be used to fetch the Active Organization.
- The [`<Protect> component`](https://clerk.com/docs/nextjs/reference/components/control/protect.md) enables you to limit who can view certain pages based on their role. Additionally, Clerk exposes a number of helper functions, such as [`auth()`](https://clerk.com/docs/reference/nextjs/app-router/auth.md), and hooks, such as [`useAuth()`](https://clerk.com/docs/nextjs/reference/hooks/use-auth.md), to check the user's authorization throughout your app and API endpoints.

The Organization's ID should be stored in your database alongside each resource so that it can be used to filter and query the resources that should be rendered or returned according to the Active Organization.

## Platforms

> Today, Clerk does not currently support the Platforms scenario. We are working on [Clerk for Platforms](https://feedback.clerk.com/roadmap/3b40265e-d8ae-41b0-a4b3-9c947d460218) to enable developers building platforms to offer their users Clerk's full range of features and customizability.

In the Platforms scenario, businesses can create multiple, isolated applications with their own user pools, branding, security policies, and limits. Some examples in this scenario are e-commerce platforms like Shopify, e-learning platforms, and mortgage lending platforms.

For example, you may be creating an e-learning platform that allows universities to create courses and enroll students. In this case, each customer would be a university who would have their own set of students, professors, and administrators as their users. Additionally, each university would likely have a custom domain (`courses.example.com`) with their branding where their users can authenticate and use the platform.

In the e-learning platform scenario, the users of one university should be completely isolated from another university and each university might have its own set of authentication strategies and security policies.

The following are some of the most commonly requested features for the Platforms scenario (Clerk for Platforms):

- Vanity domains (`customer.example.com`) or a custom domain (`customer.com`) for each of your customers
- Allow your customers to independently customize their branding, including their authentication screens, SMS and email templates
- Isolated user pools such that users from one customer are logically separated from users of another customer
- Independently enforce different limits based on your customer's subscription (for example: limit their number of users they can invite to an organization)
- Enable your customers to independently configure the authentication policies, enabled connections, and MFA policies available to their users

# Clerk Billing for B2B SaaS

> Billing is currently in Beta and its APIs are experimental and may undergo breaking changes. To mitigate potential disruptions, we recommend [pinning](https://clerk.com/docs/pinning.md) your SDK and `clerk-js` package versions.

Clerk Billing for B2B SaaS allows you to create Plans and manage Subscriptions **for companies or organizations** in your application. If you'd like to charge individual users, see [`Billing for B2C SaaS`](https://clerk.com/docs/nextjs/guides/billing/for-b2c.md). You can also combine both B2C and B2B Billing in the same application.

## Enable Billing

To enable Billing for your application, navigate to the [**Billing Settings**](https://dashboard.clerk.com/~/billing/settings) page in the Clerk Dashboard. This page will guide you through enabling Billing for your application.

Clerk Billing costs the same as using Stripe Billing directly, just 0.7% per transaction, plus transaction fees which are paid directly to Stripe. Clerk Billing is **not** the same as Stripe Billing. Plans and pricing are managed directly through the Clerk Dashboard and won't sync with your existing Stripe products or plans. Clerk uses Stripe **only** for payment processing, so you don't need to set up Stripe Billing.

### Payment gateway

Once you have enabled Billing, you will see the following **Payment gateway** options for collecting payments via Stripe:

- **Clerk development gateway**: A shared **test** Stripe account used for development instances. This allows developers to test and build Billing flows **in development** without needing to create and configure a Stripe account.
- **Stripe account**: Use your own Stripe account for production. **A Stripe account created for a development instance cannot be used for production**. You will need to create a separate Stripe account for your production environment.

## Create a Plan

Subscription Plans are what your customers subscribe to. There is no limit to the number of Plans you can create. If your Clerk instance has existing [Custom Permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md), the corresponding Features from those Permissions will automatically be added to the Free Plan for Organizations. This ensures that Organization members get the same set of Custom Permissions when Billing is enabled, because all Organizations start on the Free Plan.

To create a Plan, navigate to the [**Subscription plans**](https://dashboard.clerk.com/~/billing/plans) page in the Clerk Dashboard. Here, you can create, edit, and delete Plans. To setup B2B Billing, select the **Plans for Organizations** tab and select **Add Plan**. When creating a Plan, you can also create [Features](https://clerk.com/docs/guides/secure/features.md) for the Plan; see the next section for more information.

> What is the **Publicly available** option?
>
> ---
>
> Plans appear in some Clerk components depending on what kind of Plan it is. All Plans can appear in the `<PricingTable />` component. If it's an Organization Plan, it can appear in the `<OrganizationProfile />` component. When creating or editing a Plan, if you'd like to hide it from appearing in Clerk components, you can toggle the **Publicly available** option off.

## Add Features to a Plan

[Features](https://clerk.com/docs/guides/secure/features.md) make it easy to give entitlements to your Plans. You can add any number of Features to a Plan.

You can add a Feature to a Plan when you are creating a Plan. To add it after a Plan is created:

1. Navigate to the [**Subscription plans**](https://dashboard.clerk.com/~/billing/plans) page in the Clerk Dashboard.
2. Select the Plan you'd like to add a Feature to.
3. In the **Features** section, select **Add Feature**.

> What is the **Publicly available** option?
>
> ---
>
> Plans appear in some Clerk components depending on what kind of Plan it is. All Plans can appear in the `<PricingTable />` component. If it's an Organization Plan, it can appear in the `<OrganizationProfile />` component. When adding a Feature to a Plan, it will also automatically appear in the corresponding Plan. When creating or editing a Feature, if you'd like to hide it from appearing in Clerk components, you can toggle the **Publicly available** option off.

## Create a pricing page

You can create a pricing page by using the [`<PricingTable />`](https://clerk.com/docs/nextjs/reference/components/billing/pricing-table.md) component. This component displays a table of Plans and Features that customers can subscribe to. **It's recommended to create a dedicated page**, as shown in the following example.

```tsx {{ filename: 'app/pricing/page.tsx' }}
import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
      <PricingTable for="organization" />
    </div>
  );
}
```

## Control access with Features, Plans, and Permissions

You can use Clerk's Features, Plans, and Permissions to gate access to content using authorization checks. There are a few ways to do this, but the recommended approach is to either use the [`has()`](https://clerk.com/docs/reference/backend/types/auth-object.md#has) method or the [`<Protect>`](https://clerk.com/docs/nextjs/reference/components/control/protect.md) component.

The `has()` method is available for any JavaScript-based framework, while `<Protect>` is a component, and therefore, is only available for React-based frameworks.

> Permission-based authorization checks link with Feature-based authorization checks. This means that if you are checking a Custom Permission, it will only work if the Feature part of the Permission key (`org:<feature>:<permission>`) **is a Feature included in the Organization's active Plan**. For example, say you want to check if an Organization member has the Custom Permission `org:teams:manage`, where `teams` is the Feature. Before performing the authorization check, you need to ensure that the user's Organization is subscribed to a Plan that has the `teams` Feature. If the user's Organization is not subscribed to a Plan that has the `teams` Feature, the authorization check will always return `false`, _even if the user has the Custom Permission_.

### Example: Using `has()`

Use the `has()` method to test if the Organization has access to a **Plan**:

```jsx
const hasPremiumAccess = has({ plan: "gold" });
```

Or a **Feature**:

```jsx
const hasPremiumAccess = has({ feature: "widgets" });
```

The [`has()`](https://clerk.com/docs/reference/backend/types/auth-object.md#has) method is a server-side helper that checks if the Organization has been granted a specific type of access control (Role, Permission, Feature, or Plan) and returns a boolean value. `has()` is available on the [`auth object`](https://clerk.com/docs/reference/backend/types/auth-object.md), which you will access differently [`depending on the framework you are using`](https://clerk.com/docs/reference/backend/types/auth-object.md#how-to-access-the-auth-object).

> Why aren't Custom Permissions appearing in the session token (JWT) or in API responses (including the result of the `has()` check)?
>
> ---
>
> Custom Permissions will only appear in the session token (JWT) and in API responses (including the result of the `has()` check) if the Feature part of the Permission key (`org:<feature>:<permission>`) **is a Feature included in the Organization's active Plan**. If the Feature is not part of the Plan, the `has()` check for Permissions using that Feature will return `false`, and those Permissions will not be represented in the session token.
>
> For example, say you want to check if an Organization member has the Custom Permission `org:teams:manage`, where `teams` is the Feature. The user's Organization must be subscribed to a Plan that has the `teams` Feature for authorization checks to work. If the user's Organization is not subscribed to a Plan that has the `teams` Feature, the authorization check will always return `false`, _even if the user has the Custom Permission_.

**Plan**

The following example demonstrates how to use `has()` to check if an Organization has a Plan.

```tsx {{ filename: 'app/bronze-content/page.tsx' }}
import { auth } from "@clerk/nextjs/server";

export default async function BronzeContentPage() {
  const { has } = await auth();

  const hasBronzePlan = has({ plan: "bronze" });

  if (!hasBronzePlan)
    return (
      <h1>Only subscribers to the Bronze plan can access this content.</h1>
    );

  return <h1>For Bronze subscribers only</h1>;
}
```

**Feature**

The following example demonstrates how to use `has()` to check if an Organization has a Feature.

```tsx {{ filename: 'app/premium-content/page.tsx' }}
import { auth } from "@clerk/nextjs/server";

export default async function PremiumContentPage() {
  const { has } = await auth();

  const hasPremiumAccess = has({ feature: "premium_access" });

  if (!hasPremiumAccess)
    return (
      <h1>
        Only subscribers with the Premium Access feature can access this
        content.
      </h1>
    );

  return <h1>Our Exclusive Content</h1>;
}
```

**Permission**

The following example demonstrates how to use `has()` to check if an Organization has a Permission.

```tsx {{ filename: 'app/manage-premium-content/page.tsx' }}
import { auth } from "@clerk/nextjs/server";

export default async function ManagePremiumContentPage() {
  const { has } = await auth();

  const hasPremiumAccessManage = has({
    permission: "org:premium_access:manage",
  });

  if (!hasPremiumAccessManage)
    return (
      <h1>
        Only subscribers with the Premium Access Manage permission can access
        this content.
      </h1>
    );

  return <h1>Our Exclusive Content</h1>;
}
```

### Example: Using `<Protect>`

The [`<Protect>`](https://clerk.com/docs/nextjs/reference/components/control/protect.md) component protects content or even entire routes by checking if the Organization has been granted a specific type of access control (Role, Permission, Feature, or Plan). You can pass a `fallback` prop to `<Protect>` that will be rendered if the Organization does not have the access control.

**Plan**

The following example demonstrates how to use `<Protect>` to protect a page by checking if the Organization has a Plan.

```tsx {{ filename: 'app/protected-content/page.tsx' }}
import { Protect } from "@clerk/nextjs";

export default function ProtectedContentPage() {
  return (
    <Protect
      plan="bronze"
      fallback={
        <p>Only subscribers to the Bronze plan can access this content.</p>
      }
    >
      <h1>Exclusive Bronze Content</h1>
      <p>This content is only visible to Bronze subscribers.</p>
    </Protect>
  );
}
```

**Feature**

The following example demonstrates how to use `<Protect>` to protect a page by checking if the Organization has a Feature.

```tsx {{ filename: 'app/protected-premium-content/page.tsx' }}
import { Protect } from "@clerk/nextjs";

export default function ProtectedPremiumContentPage() {
  return (
    <Protect
      feature="premium_access"
      fallback={
        <p>
          Only subscribers with the Premium Access feature can access this
          content.
        </p>
      }
    >
      <h1>Exclusive Premium Content</h1>
      <p>This content is only visible to users with Premium Access feature.</p>
    </Protect>
  );
}
```

**Permission**

The following example demonstrates how to use `<Protect>` to protect a page by checking if the Organization has a Permission.

```tsx {{ filename: 'app/protected-manage-content/page.tsx' }}
import { Protect } from "@clerk/nextjs";

export default function ProtectedManageContentPage() {
  return (
    <Protect
      permission="premium_access:manage"
      fallback={
        <p>
          Only subscribers with the Premium Access Manage permission can access
          this content.
        </p>
      }
    >
      <h1>Exclusive Management Content</h1>
      <p>
        This content is only visible to users with Premium Access Manage
        permission.
      </p>
    </Protect>
  );
}
```

# Get started with Organizations

Organizations let you group users with Roles and Permissions, enabling you to build multi-tenant B2B apps like Slack (workspaces), Linear (teams), or Vercel (projects) where users can switch between different team contexts. This tutorial will demonstrate how to add Organizations, create and switch Organizations, and protect routes by Organization and Roles.

> This guide assumes that you have already set up Clerk in your application. If you haven't, see the [`quickstart guide`](https://clerk.com/docs/nextjs/getting-started/quickstart.md).

1. ## Add `<OrganizationSwitcher/>` to your app

   The [`<OrganizationSwitcher />`](https://clerk.com/docs/nextjs/reference/components/organization/organization-switcher.md) component is the easiest way to let users create, switch between, and manage Organizations. It's recommended to place it in your app's header or navigation so it's always accessible to your users. For example:

   ```tsx {{ filename: 'app/layout.tsx', fold: [[11, 28]] }}
     import type { Metadata } from 'next'
     import {
       ClerkProvider,
       SignInButton,
       SignUpButton,
       SignedIn,
       SignedOut,
       UserButton,
   +   OrganizationSwitcher,
     } from '@clerk/nextjs'
     import { Geist, Geist_Mono } from 'next/font/google'
     import './globals.css'

     const geistSans = Geist({
       variable: '--font-geist-sans',
       subsets: ['latin'],
     })

     const geistMono = Geist_Mono({
       variable: '--font-geist-mono',
       subsets: ['latin'],
     })

     export const metadata: Metadata = {
       title: 'Clerk Next.js Quickstart',
       description: 'Generated by create next app',
     }

     export default function RootLayout({
       children,
     }: Readonly<{
       children: React.ReactNode
     }>) {
       return (
         <ClerkProvider>
           <html lang="en">
             <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
               <header className="flex justify-end items-center p-4 gap-4 h-16">
   +             <OrganizationSwitcher />
                 <SignedOut>
                   <SignInButton />
                   <SignUpButton>
                     <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                       Sign Up
                     </button>
                   </SignUpButton>
                 </SignedOut>
                 <SignedIn>
                   <UserButton />
                 </SignedIn>
               </header>
               {children}
             </body>
           </html>
         </ClerkProvider>
       )
     }
   ```

2. ## Access Organization data

   **Server-side**

   To access information about the currently Active Organization on the server-side, use [`clerkClient()`](https://clerk.com/docs/js-backend/getting-started/quickstart.md#instantiate-a-default-clerk-client-instance) to call the [`getOrganization()`](https://clerk.com/docs/reference/backend/organization/get-organization.md) method, which returns the Backend [`Organization`](https://clerk.com/docs/reference/backend/types/backend-organization.md) object. You'll need to pass an `orgId`, which you can access from the [`Auth`](https://clerk.com/docs/reference/backend/types/auth-object.md) object.

   ```tsx {{ filename: 'app/page.tsx' }}
   import { auth, clerkClient } from "@clerk/nextjs/server";
   import { OrganizationSwitcher } from "@clerk/nextjs";

   export default async function Page() {
     // Use `auth()` to access the `Auth` object
     // https://clerk.com/docs/reference/backend/types/auth-object
     const { isAuthenticated, orgId, orgRole } = await auth();

     // Check if user is authenticated
     if (!isAuthenticated)
       return <p>You must be signed in to access this page.</p>;

     // Check if there is an Active Organization
     if (!orgId) return <p>Set an Active Organization to access this page.</p>;

     // Initialize the JS Backend SDK
     // This varies depending on the SDK you're using
     // https://clerk.com/docs/js-backend/getting-started/quickstart
     const client = await clerkClient();

     // Use the `getOrganization()` method to get the Backend `Organization` object
     const organization = await client.organizations.getOrganization({
       organizationId: orgId,
     });

     return (
       <div class="p-8">
         <h1 class="text-2xl font-bold mb-4">
           Welcome to the <strong>{organization.name}</strong> organization
         </h1>
         <p class="mb-6">
           Your role in this organization: <strong>{orgRole}</strong>
         </p>
       </div>
     );
   }
   ```

   **Client-side**

   Use the [`useOrganization()`](https://clerk.com/docs/nextjs/reference/hooks/use-organization.md) hook to access information about the currently Active Organization. Use the [`useOrganizationList()`](https://clerk.com/docs/nextjs/reference/hooks/use-organization-list.md) hook to access information about the current user's Organization memberships.

   ```tsx {{ filename: 'app/page.tsx' }}
   "use client";

   import { useOrganization, useOrganizationList } from "@clerk/nextjs";

   export default function Page() {
     const { organization } = useOrganization();
     const { userMemberships } = useOrganizationList({
       userMemberships: true,
     });

     return (
       <div className="p-8">
         <h1 className="text-2xl font-bold mb-4">
           Welcome to the <strong>{organization?.name}</strong> organization
         </h1>
         <p className="mb-6">
           Your role in this organization:{" "}
           <strong>
             {/* Find the organization membership that matches the
                  currently active organization and return the role */}
             {
               userMemberships?.data?.find(
                 (membership) =>
                   membership.organization.id === organization?.id,
               )?.role
             }
           </strong>
         </p>
       </div>
     );
   }
   ```

3. ## Visit your app

   Run your project with the following command:

   ```npm
   npm run dev
   ```

   Visit your app locally at [localhost:3000](http://localhost:3000).

   When you visit your app, Clerk will prompt you to enable Organizations.

4. ### Enable Organizations

   When prompted, select **Enable Organizations**. Choose to make membership required.

5. ### Create first user and Organization

   You must sign in to use Organizations. When prompted, select **Sign in to continue**. Then, authenticate to create your first user.

   Since you chose to make membership required when you enabled Organizations, every user must be in at least one Organization. Clerk will prompt you to create an Organization for your user.

6. ## Create and switch Organizations

   At this point, Clerk should have redirected you to a page with the [`<OrganizationSwitcher />`](https://clerk.com/docs/nextjs/reference/components/organization/organization-switcher.md) component. This component allows you to create, switch between, and manage organizations.
   1. Select the `<OrganizationSwitcher />` component, then **Create an organization**.
   2. Enter `Acme Corp` as the Organization name.
   3. Invite users to your Organization and select their Role.

7. ## Protect routes by Organization and Roles

   You can protect content and even entire routes based on Organization membership, Roles, and Permissions by performing authorization checks.

   In the following example, the page is protected from unauthenticated users, users that don't have the `org:admin` Role, and users that are not in the `Acme Corp` Organization. It uses the [`has()`](https://clerk.com/docs/reference/backend/types/auth-object.md#has) helper to perform the authorization check for the `org:admin` Role.

   **Server-side**

   ```tsx {{ filename: 'app/protected/page.tsx', collapsible: true }}
   import { auth, clerkClient } from "@clerk/nextjs/server";
   import { OrganizationSwitcher } from "@clerk/nextjs";

   export default async function Page() {
     const { isAuthenticated, orgId, has } = await auth();

     // Check if the user is authenticated
     if (!isAuthenticated)
       return <p>You must be signed in to access this page.</p>;

     // Check if there is an Active Organization
     if (!orgId) return <p>Set an Active Organization to access this page.</p>;

     // Check if the user has the `org:admin` Role
     if (!has({ role: "org:admin" }))
       return <p>You must be an admin to access this page.</p>;

     // Initialize the JS Backend SDK
     // This varies depending on the SDK you're using
     // https://clerk.com/docs/js-backend/getting-started/quickstart
     const client = await clerkClient();

     // Use the `getOrganization()` method to get the Backend `Organization` object
     const organization = await client.organizations.getOrganization({
       organizationId: orgId,
     });

     // Check if Organization name matches (e.g. 'Acme Corp')
     if (organization.name !== requiredOrgName)
       return (
         <p>
           This page is only accessible in the{" "}
           <strong>{requiredOrgName}</strong> Organization. Switch to the{" "}
           <strong>{requiredOrgName}</strong> Organization to access this page.
         </p>
       );

     return (
       <p>
         You are currently signed in as an <strong>admin</strong> in the{" "}
         <strong>{organization.name}</strong> Organization.
       </p>
     );
   }
   ```

   **Client-side**

   ```tsx {{ filename: 'app/protected/page.tsx', collapsible: true }}
   "use client";
   import {
     OrganizationSwitcher,
     useAuth,
     useOrganization,
   } from "@clerk/nextjs";

   export default function Page() {
     // The `useAuth()` hook gives you access to properties like `isSignedIn` and `has()`
     const { isSignedIn, has } = useAuth();
     const { organization } = useOrganization();
     const requiredOrgName = "Acme Corp";

     // Check if the user is authenticated
     if (!isSignedIn) return <p>You must be signed in to access this page.</p>;

     // Check if there is an Active Organization
     if (!organization)
       return <p>Set an active organization to access this page.</p>;

     // Check if the user has the `org:admin` Role
     if (!has({ role: "org:admin" }))
       return <p>You must be an admin to access this page.</p>;

     // Check if Organization name matches (e.g. 'Acme Corp')
     if (organization.name !== requiredOrgName)
       return (
         <p>
           This page is only accessible in the{" "}
           <strong>{requiredOrgName}</strong> Organization. Switch to the{" "}
           <strong>{requiredOrgName}</strong> Organization to access this page.
         </p>
       );

     return (
       <p>
         You are currently signed in as an <strong>admin</strong> in the{" "}
         <strong>{organization.name}</strong> Organization.
       </p>
     );
   }
   ```

   Navigate to [localhost:3000/protected](http://localhost:3000/protected). You should see a green message confirming you are an admin in `Acme Corp`. Use the `<OrganizationSwitcher/>` to switch Organizations or rename the Organization to show the red message.

   Learn more about protecting routes and checking Organization Roles in the [authorization guide](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md).

8. ## It's time to build your B2B SaaS!

   You've added Clerk Organizations to your app 🎉.

   To make configuration changes to your Clerk development instance, claim the Clerk keys that were generated for you by selecting **Claim your application** in the bottom right of your app. This will associate the application with your Clerk account.

   Here are some next steps you can take to scale your app:
   - **Control access** with [Custom Roles and Permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md): define granular Permissions for different user types within Organizations.

   - **Onboard entire companies** with [Verified Domains](https://clerk.com/docs/guides/organizations/add-members/verified-domains.md): automatically invite users with approved email domains (e.g. `@company.com`) to join Organizations without manual invitations.

   - **Enable Enterprise SSO** with [SAML and OIDC](https://clerk.com/docs/guides/organizations/add-members/sso.md): let customers authenticate through their identity provider (e.g. Okta, Entra ID, Google Workspace) with unlimited connections, no per-connection fees.

# Configure Organizations

Global Organization settings control how Organizations work across your entire application. These settings determine who can create Organizations, how members join them, what Roles they receive, and which Features are available. You'll configure most of these when you first enable Organizations, though you can adjust them later as your needs evolve.

## Enable Organizations

Organizations are disabled by default. When you enable Organizations, Clerk offers two membership requirement options:

- **Membership required (default)**: Every user is required to belong to an Organization. All new and existing users will be prompted to create or join an Organization through the [session tasks flow](https://clerk.com/docs/guides/configure/session-tasks.md) before they can access your application. This setting is common for most B2B SaaS. It's recommended to enable the [Create first organization automatically](#create-first-organization-automatically) setting to simplify this process.

  > This is the default setting since on August 22, 2025. Applications created before this date will not see the **Membership required** setting, because organization membership was optional.

- **Membership optional**: Users can operate in their own individual workspace or join Organizations. They start in their [Personal Account](#personal-accounts) and can switch to Organizations using the [`<OrganizationSwitcher />`](https://clerk.com/docs/nextjs/reference/components/organization/organization-switcher.md) component. This setting is common for B2C applications moving to B2B.

For most B2B and multi-tenant applications, requiring organization membership is recommended to ensure proper data isolation and team structure from the start. Making membership optional is only recommended if the application serves both individual users and teams (such as tools that work for solo users but also provide team features).

To enable Organizations:

1. In the Clerk Dashboard, navigate to the [**Organizations Settings**](https://dashboard.clerk.com/~/organizations-settings) page.
2. Select **Enable Organizations**.
3. In the modal, choose between **Membership required** or **Membership optional** based on your decision above.
4. Select **Enable**.

Clerk measures Organizations by Monthly Retained Organizations (MROs). Refer to the [overview page](https://clerk.com/docs/guides/organizations/overview.md#how-do-organizations-work) for pricing details and limits.

## Organization settings

Once Organizations are enabled, you can configure core features and behaviors, such as membership limits, Verified Domains, Organization slugs, and whether to allow Personal Accounts alongside Organizations.

### Membership limits

There is no limit to the number of Organizations a user can be a member of.

Each Organization allows a maximum of 5 members by default. You can increase this limit as your customer base grows, or set different limits for individual Organizations.

To change the membership limit for all Organizations in your application:

1. In the Clerk Dashboard, navigate to the [**Organizations Settings**](https://dashboard.clerk.com/~/organizations-settings) page.
2. In the **Default membership limit** section, update the membership limit.
   - **Without B2B Authentication add-on**: Allows a maximum of 20 members in an Organization
   - **With B2B Authentication add-on**: Allows unlimited members in an Organization

To change the membership limit for a specific Organization:

1. In the Clerk Dashboard, select [**Organizations**](https://dashboard.clerk.com/~/organizations).
2. Select the Organization you want to update.
3. In the **Membership limit** section, update the limit for that specific Organization.

### Personal Accounts

When enabling the Organizations feature, you were prompted to choose whether to make membership required (the default) or optional. If you chose to make membership optional, this enabled the Personal Accounts feature.

Personal Accounts are individual workspaces that allow users to operate independently without belonging to an Organization. When Personal Accounts are enabled, users start in their Personal Account by default and can switch between their Personal Account and any Organizations they belong to.

**When to enable Personal Accounts:**

Enable Personal Accounts if your application serves both individual users and teams. For example:

- A tool that works for solo users but also offers team collaboration features (like GitHub, where users can create repositories under their Personal Account or an Organization)
- Applications where users might want to work independently before joining or creating a team

**When to disable Personal Accounts:**

Most B2B and multi-tenant applications should leave Personal Accounts disabled. This ensures:

- Proper data isolation from the start.
- Clear team structure requirements.
- All users are part of an Organization, which is essential for proper access control and billing.

**Changing this setting:**

1. In the Clerk Dashboard, navigate to the [**Organizations Settings**](https://dashboard.clerk.com/~/organizations-settings) page.
2. Choose **Membership optional**.

### Verified Domains

Verified Domains allow automatic or suggested Organization membership for users with specific email domains (like `@acme.com`). This is useful for company-wide rollouts where you want to streamline enrollment for employees with company email addresses. Members with the [`org:sys_domains:manage` System Permission](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md#system-permissions) can manage Verified Domains and enrollment modes.

Learn more about [Verified Domains](https://clerk.com/docs/guides/organizations/add-members/verified-domains.md).

### Organization slugs

> Organization slugs are disabled by default for applications created after October 7, 2025. For applications created before this date, you can opt to disable it.

Organization slugs are human-readable URL identifiers (like `acme-corp`) that help users reference which Organization they're working in. Enable this feature if you need Organization-specific URLs or if users frequently switch between multiple Organizations.

You can also [use Organization slugs in your application's URLs](https://clerk.com/docs/guides/organizations/org-slugs-in-urls.md).

### Create first organization automatically

Clerk can automatically create the user's first Organization. This is useful if your application requires every user to belong to an Organization.

This setting is disabled by default. To enable it:

1. In the Clerk Dashboard, navigate to the [**Organizations Settings**](https://dashboard.clerk.com/~/organizations-settings) page.
2. Toggle **Create first organization automatically**.

### Default naming rules

Default naming rules automatically suggest an Organization name (and logo, when possible) when users create their first Organization.

These rules can be used on their own or in combination with the [Create first organization automatically](#create-first-organization-automatically) setting:

- When **Create first organization automatically** is enabled, these rules are used to name the automatically created Organization.
- When **Create first organization automatically** is disabled, these rules are used to prefill the Organization name when the user creates their first Organization manually.

Rules are applied in this order:

1. **Detect from email domain** automatically populates the Organization name, slug, and logo from the member's email domain (e.g., `alex@clerk.com` → "Clerk").
2. **Personalize from member name** uses member details to create a personalized Organization name. You can customize the template using variables like `user.first_name`, `user.last_name`, `user.full_name`, or `user.username` (e.g., `{{user.first_name}}'s organization` → "Alex's organization").
3. **Fallback name** is used when no other rule can generate an Organization name. By default, this is set to "My organization".

This setting is disabled by default. To enable it:

1. In the Clerk Dashboard, navigate to the [**Organizations Settings**](https://dashboard.clerk.com/~/organizations-settings) page.
2. Toggle **Default naming rules**.
3. Under **Default naming rules**, you can disable email domain detection or member personalization rules individually. This will skip those rules when suggesting an Organization name.

### Allow user-created Organizations

By default, users can create Organizations in your application. You can restrict this if you prefer to manually provision Organizations.

You can also override this Permission for specific users in their profile page under **User permissions**.

Learn more about [creating Organizations](https://clerk.com/docs/guides/organizations/create-and-manage.md).

#### Organization creation limit

When user-created Organizations are enabled, each user can create up to 100 Organizations by default. You can configure this to set a lower limit or allow unlimited Organizations.

To change the default limit:

1. In the Clerk Dashboard, navigate to the [**Organizations Settings**](https://dashboard.clerk.com/~/organizations-settings) page.
2. In the **Organization limit** section, choose between:
   - **Users can create unlimited organizations**
   - **Users can create a limited number of organizations** (specify the limit)

If you need users to create more than 100 Organizations, [contact support](https://clerk.com/contact/support){{ target: '_blank' }} to have the limit raised.

To override this limit for a specific user:

1. In the Clerk Dashboard, select [**Users**](https://dashboard.clerk.com/~/users).
2. Select the user you want to update.
3. In the **User permissions** section, configure their Organization creation limit.

### Default roles

When users create or join Organizations, they need to be assigned a role. These settings determine which roles are automatically assigned in different scenarios, whether someone is creating a new Organization or joining an existing one.

#### Default role for members

The default role for members is assigned to users when they join an Organization through invitations or Verified Domain enrollment. By default, this is set to [**Member**](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md#default-roles).

This role is used:

- When sending invitations from the [`<OrganizationProfile />`](https://clerk.com/docs/nextjs/reference/components/organization/organization-profile.md) component (pre-filled as default)
- When users auto-join via [Verified Domains](https://clerk.com/docs/guides/organizations/add-members/verified-domains.md)
- As the suggested role for new Organization members

To change the default role:

1. In the Clerk Dashboard, navigate to the [**Roles & Permissions**](https://dashboard.clerk.com/~/organizations-settings/roles) page.
2. Select the three dots next to the role you want to set as default.
3. Choose **Set as Default role**.

Learn more about [Roles and Permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md).

#### Creator's initial role

When a user creates a new Organization, Clerk automatically adds them as its first member and assigns them the Organization's designated **Creator** Role. By default, that Role is [**Admin**](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md#default-roles), giving them full control over the Organization they created.

The Creator role must have at least these [System Permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md#system-permissions):

- Manage members (`org:sys_memberships:manage`)
- Read members (`org:sys_memberships:read`)
- Delete Organization (`org:sys_profile:delete`)

Learn more about the [Creator Role and how to reassign it](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md#the-creator-role).

### Allow new members to delete Organizations

This setting controls whether Organization members can delete Organizations.

By default, any member with the [`org:sys_profile:delete` System Permission](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md#system-permissions) can delete an Organization. You can disable this if you want to prevent accidental data loss or require your own approval process before Organizations are removed.

To change this setting:

1. In the Clerk Dashboard, navigate to the [**Organizations Settings**](https://dashboard.clerk.com/~/organizations-settings) page.
2. Toggle **Allow new members to delete organizations**.

> This setting only applies to newly created Organizations. Existing Organizations retain their current deletion settings.

## Next steps

Now that you've configured global settings, you can:

- [Create your first Organization](https://clerk.com/docs/guides/organizations/create-and-manage.md): Learn how to create your first Organization and start adding members.
- [Add members to your Organization](https://clerk.com/docs/guides/organizations/add-members/invitations.md): Learn how to add members to your Organization with invitations, Verified Domains, or SSO.
- [Control access based on Roles and Permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md): Learn how to configure access control with Custom Roles and Permissions.

# Create and manage Organizations

Organizations can be created and managed either **in the Clerk Dashboard** or **in your application**. This guide covers working with individual Organizations. For global settings that affect all Organizations in your application (like enabling Organizations, setting default Roles, or configuring memberships), refer to the [dedicated guide](https://clerk.com/docs/guides/organizations/configure.md).

## Create an Organization

Organizations can be created in the Clerk Dashboard or in your application. The number of Organizations you can create depends on your [Monthly Retained Organization (MRO) limits](https://clerk.com/docs/guides/organizations/overview.md#how-do-organizations-work).

### Create an Organization in the Clerk Dashboard

To create an Organization in the Clerk Dashboard, navigate to the [**Organizations**](https://dashboard.clerk.com/~/organizations) page and select the **Create Organization** button.

### Create an Organization in your application

By default, [users have permission to create Organizations within your application](https://clerk.com/docs/guides/organizations/configure.md#allow-user-created-organizations). When a user creates an Organization, they become the Organization's [admin](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md#default-roles) with full control over settings, members, and Permissions.

**Default limits**: Each user can create up to 100 Organizations. To change creation permissions or limits, see the [dedicated guide](https://clerk.com/docs/guides/organizations/configure.md#allow-user-created-organizations).

The easiest way to allow users to create Organizations is to use the [`<CreateOrganization />`](https://clerk.com/docs/nextjs/reference/components/organization/create-organization.md) and/or [`<OrganizationSwitcher />`](https://clerk.com/docs/nextjs/reference/components/organization/organization-switcher.md) components. The `<OrganizationSwitcher />` component is more comprehensive, as it handles all Organization flows including creating, switching, and managing an Organization.

If the prebuilt components don't meet your needs, you can build [custom flows](https://clerk.com/docs/guides/development/custom-flows/overview.md) using the Clerk API.

## Manage Organizations

As an application owner, you can manage all Organizations in your application, both those created by you and those created by your users. You can view, update, and delete any Organization, as well as manage its members and settings.

### Manage Organizations in the Clerk Dashboard

To manage an Organization in the Clerk Dashboard, navigate to the [**Organizations**](https://dashboard.clerk.com/~/organizations) page. Select a specific Organization to view its details, members, invitations, Subscriptions, payments, and settings.

### Manage Organizations in your application

For managing Organizations in your application, Clerk provides prebuilt components that handle Organization management flows:

- [`<OrganizationProfile />`](https://clerk.com/docs/nextjs/reference/components/organization/organization-profile.md) - A profile page for the user's currently active Organization where they can update settings and manage members.
- [`<OrganizationSwitcher />`](https://clerk.com/docs/nextjs/reference/components/organization/organization-switcher.md) - A dropdown menu that handles all Organization flows, including switching between Organizations and managing the active Organization's profile.
- [`<OrganizationList />`](https://clerk.com/docs/nextjs/reference/components/organization/organization-list.md) - A list of Organizations that a user is a member of, with options to switch between them.

If the prebuilt components don't meet your needs, you can build [custom flows](https://clerk.com/docs/guides/development/custom-flows/overview.md) using the Clerk API.

## Switch between Organizations

Users who belong to multiple Organizations can switch between them at any time. The currently selected Organization is called the active Organization.

The [`<OrganizationSwitcher />`](https://clerk.com/docs/nextjs/reference/components/organization/organization-switcher.md) component provides the easiest way for users to switch between Organizations. If you need more control over the switching logic, you can use the `setActive()` method from the [`useOrganizationList()`](https://clerk.com/docs/nextjs/reference/hooks/use-organization-list.md) hook, or access it directly from the [`Clerk`](https://clerk.com/docs/reference/javascript/clerk.md#set-active) object.

If Personal Accounts are enabled, users can switch to their Personal Account using the `<OrganizationSwitcher />` component.

## Next steps

Now that you've created and managed Organizations, you can:

- [Add custom data with Organization metadata](https://clerk.com/docs/guides/organizations/metadata.md): Learn how to store custom information about an Organization that is not part of the standard fields.
- [Use Organization slugs in URLs](https://clerk.com/docs/guides/organizations/org-slugs-in-urls.md): Learn how to use Organization slugs in URLs for tenant-specific routing.
- [Invite members to Organizations](https://clerk.com/docs/guides/organizations/add-members/invitations.md): Learn how to invite members to Organizations.
- [Set up Roles and Permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md): Learn how to set up Roles and Permissions to control what invited users can access.

# Invite users to your Organization

Organization invitations let you add new members to your Organization. When you send an invitation, Clerk sends an email to the invited user with a unique invitation link. When the user visits the Organization invitation link, Clerk redirects them to the [Account Portal sign-in page](https://clerk.com/docs/guides/account-portal/overview.md#sign-in). If the user is already signed in, Clerk redirects them to your application's homepage (`/`). If you want to redirect the user to a specific page in your application, you can [specify a redirect URL when creating the invitation](#redirect-url).

By default, only [admins](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md#default-roles) can invite users to an Organization.

This feature requires that [**Email** is enabled](https://clerk.com/docs/guides/configure/auth-strategies/sign-up-sign-in-options.md#email), as Clerk uses the user's email address to send the invitation. You can still disable **Email** as a sign-in option if you do not want users to be able to sign-in with their email address.

To configure your application's **Email** settings, navigate to the [**User & authentication**](https://dashboard.clerk.com/~/user-authentication/user-and-authentication) page in the Clerk Dashboard.

## When to use invitations

Invitations work well when you need precise control over who joins your Organization and which Role they receive. This approach fits scenarios where:

- Teams are small and members are known in advance.
- Onboarding requires manual approval or review.
- Specific Roles need to be assigned during the invitation.

If you want to streamline enrollment for users with company email addresses, consider [Verified Domains](https://clerk.com/docs/guides/organizations/add-members/verified-domains.md), which can automatically invite users based on their email domain. If customers require centralized authentication through their Identity Provider, use [Enterprise SSO](https://clerk.com/docs/guides/organizations/add-members/sso.md).

## Create an invitation

Clerk's [`prebuilt components`](https://clerk.com/docs/nextjs/reference/components/overview.md) and [Account Portal pages](https://clerk.com/docs/guides/account-portal/overview.md) manage all Organization invitation flows, including creating, managing, and accepting invitations.

However, if you want to build custom flows, see the following sections.

### Client-side

To create an Organization invitation on the client-side, see the [dedicated guide](https://clerk.com/docs/guides/development/custom-flows/organizations/manage-organization-invitations.md). Note that this uses the [`organizations.inviteMember()`](https://clerk.com/docs/reference/javascript/organization.md#invite-member) method, which does not let you specify a redirect URL; it will always redirect to the Account Portal sign-in page. If you want to specify a redirect URL, you must create the invitation on the server-side.

### Server-side

To create Organization invitations on the server-side, use the [Backend API](https://clerk.com/docs/reference/backend-api/tag/organization-invitations/post/organizations/%7Borganization_id%7D/invitations.md){{ target: '_blank' }} either by using a cURL command or the [`JS Backend SDK`](https://clerk.com/docs/js-backend/getting-started/quickstart.md). The JS Backend SDK is a wrapper around the Backend API that makes it easier to interact with the API.

Use the following tabs to see examples for each method.

**cURL**

The following example demonstrates how to create an Organization invitation using cURL.

- Your Secret Key is already injected into the code snippet.
- Replace the `org_123` with the ID of the Organization you want to invite the user to.
- Replace the `user_123` with the ID of the user who is inviting the other user.
- Replace the email address with the email address you want to invite.
- Replace the `role` with the role you want to assign to the invited user.

* Replace `YOUR_SECRET_KEY` with your Clerk Secret Key.
* Replace the `org_123` with the ID of the Organization you want to invite the user to.
* Replace the `user_123` with the ID of the user who is inviting the other user.
* Replace the email address with the email address you want to invite.
* Replace the `role` with the Role you want to assign to the invited user.

```bash {{ filename: 'terminal' }}
curl 'https://api.clerk.com/v1/organizations/{org_123}/invitations' \
-X POST \
-H 'Authorization: Bearer {{secret}}' \
-H 'Content-Type: application/json' \
-d '{ "inviter_user_id": "user_123", "email_address": "email@example.com", "role": "org:member" }'
```

**JS Backend SDK**

To use the JS Backend SDK to create an invitation, see the [`createOrganizationInvitation()`](https://clerk.com/docs/reference/backend/organization/create-organization-invitation.md) reference documentation.

For an example of the response, see the [Backend API reference](https://clerk.com/docs/reference/backend-api/tag/organization-invitations/post/organizations/%7Borganization_id%7D/invitations.md){{ target: '_blank' }}.

### Redirect URL

When you create an invitation, you can specify a `redirect_url` parameter. This parameter tells Clerk where to redirect the user when they visit the invitation link.

The following example demonstrates how to use cURL to create an invitation with the `redirect_url` set to `https://www.example.com/accept-invitation`.

```bash
curl 'https://api.clerk.com/v1/organizations/{org_123}/invitations' \
  -X POST \
  -H 'Authorization: Bearer {{secret}}' \
  -H 'Content-Type: application/json' \
  -d '{ "inviter_user_id": "user_123", "email_address": "email@example.com", "role": "org:member", "redirect_url": "https://www.example.com/accept-invitation" }'
```

Once the user visits the invitation link, they will be redirected to the page you specified. On that page, you must handle the authentication flow in your code. You can either embed the [`<SignIn />`](https://clerk.com/docs/nextjs/reference/components/authentication/sign-in.md) component or, if the prebuilt component doesn't meet your needs or you require more control over the logic, you can build a [custom flow](https://clerk.com/docs/guides/development/custom-flows/organizations/accept-organization-invitations.md).

> To test redirect URLs in your development environment, pass your port. For example, `http://localhost:3000/accept-invitation`.

### Invitation metadata

You can also add metadata to an invitation when creating the invitation through the Backend API. Once the invited user signs up using the invitation link, Clerk stores the **invitation** metadata (`OrganizationInvitation.publicMetadata`) in the Organization **membership's** metadata (`OrganizationMembership.publicMetadata`). For more details on Organization membership metadata, see the [OrganizationMembership](https://clerk.com/docs/reference/javascript/types/organization-membership.md) reference.

To add metadata to an invitation, add the `public_metadata` parameter when creating the invitation.

The following example demonstrates how to use cURL to create an invitation with metadata.

```bash
curl 'https://api.clerk.com/v1/organizations/{org_123}/invitations' \
  -X POST \
  -H 'Authorization: Bearer {{secret}}' \
  -H 'Content-Type: application/json' \
  -d '{ "inviter_user_id": "user_123", "email_address": "email@example.com", "role": "org:member", "public_metadata": {"department": "marketing"} }'
```

## Revoke an invitation

Revoking an invitation prevents the user from using the invitation link that was sent to them.

### Client-side

To revoke an invitation client-side, see the [dedicated guide](https://clerk.com/docs/guides/development/custom-flows/organizations/manage-organization-invitations.md).

### Server-side

To revoke an invitation server-side, use the [Backend API](https://clerk.com/docs/reference/backend-api/tag/organization-invitations/post/organizations/%7Borganization_id%7D/invitations/%7Binvitation_id%7D/revoke.md){{ target: '_blank' }}. either by using a cURL command or the [`JS Backend SDK`](https://clerk.com/docs/js-backend/getting-started/quickstart.md). The JS Backend SDK is a wrapper around the Backend API that makes it easier to interact with the API.

Use the following tabs to see examples for each method.

**cURL**

The following example demonstrates how to revoke an invitation using cURL.

- Your Secret Key is already injected into the code snippet.
- Replace the `inv_123` with the ID of the invitation you want to revoke.
- Replace the `user_123` with the ID of the user who is revoking the invitation.

* Replace `YOUR_SECRET_KEY` with your Clerk Secret Key.
* Replace the `inv_123` with the ID of the invitation you want to revoke.
* Replace the `user_123` with the ID of the user who is revoking the invitation.

```bash {{ filename: 'terminal' }}
curl 'https://api.clerk.com/v1/organizations/{org_123}/invitations/{inv_123}/revoke' \
  -X POST \
  -H 'Authorization: Bearer {{secret}}' \
  -H 'Content-Type: application/json' \
  -d '{ "requesting_user_id": "user_123" }'
```

**JS Backend SDK**

To use the JS Backend SDK to revoke an Organization invitation, see the [`revokeOrganizationInvitation()`](https://clerk.com/docs/reference/backend/organization/revoke-organization-invitation.md) reference documentation.

## Next steps

Now that you understand how to invite users to your Organization, you can:

- [Configure Verified Domains](https://clerk.com/docs/guides/organizations/configure.md): Learn how to configure Verified Domains to automatically invite users based on their email domain.
- [Set up Enterprise SSO Connections](https://clerk.com/docs/guides/organizations/add-members/sso.md): Learn how to set up Enterprise SSO Connections for centralized authentication through an Identity Provider.
- [Set up Roles and Permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md): Learn how to set up Roles and Permissions to control what invited users can access.
- [Add metadata to invitations](https://clerk.com/docs/guides/organizations/metadata.md): Learn how to add metadata to invitations for tracking or custom workflows.

# Roles and Permissions

> This feature requires a [paid plan](https://clerk.com/pricing){{ target: '_blank' }} for production use, but all features are free to use in development mode so that you can try out what works for you. See the [pricing](https://clerk.com/pricing){{ target: '_blank' }} page for more information.

Roles and Permissions let you control who can access specific resources and perform certain actions within each Organization. Clerk provides two default Roles - **admin** and **member** - that cover most common use cases. You can also create custom Roles and fine-grained Permissions that fit your application's specific features and team setup.

Roles are made available to Organizations through [Role Sets](https://clerk.com/docs/guides/organizations/control-access/role-sets.md). Each Organization is assigned a Role Set that determines which Roles can be assigned to its members.

## Roles

Each Role defines what users can do and access within an Organization. You can extend a Role's capabilities by adding [Permissions](#permissions).

### Default Roles

When users create or join Organizations, they need to be assigned a Role. These settings determine which Roles are automatically assigned in different scenarios, whether someone is creating a new Organization or joining an existing one.

For each instance, there are currently two default Roles:

- **Admin (`org:admin`)** - Offers full access to Organization resources. Members with the admin Role have all of the [System Permissions](#system-permissions). They can fully manage the Organization and Organization memberships.
- **Member (`org:member`)** - Offers limited access to Organization resources. Access to Organization resources is limited to the "Read members" and "Read billing" Permissions only, by default. They cannot manage the Organization and Organization memberships, but they can view information about other members in it.

### The **Creator** Role

When a user creates a new Organization, Clerk automatically adds them as its first member and assigns them the Organization's designated **Creator** Role. By default, that Role is `org:admin`.

You cannot delete an Organization Role if it's used as the Organization's **Creator** Role. But, you _can_ reassign the **Creator** Role to any other Role with the right Permissions. For example, if you want to delete the `admin` Role, you will have to assign another Role as the **Creator** Role.

The **Creator** Role must _at least_ have the following [System Permissions](#system-permissions):

- Manage members (`org:sys_memberships:manage`)
- Read members (`org:sys_memberships:read`)
- Delete Organization (`org:sys_profile:delete`)

To reassign the **Creator** Role:

1. In the Clerk Dashboard, navigate to [**Roles & Permissions**](https://dashboard.clerk.com/~/organizations-settings/roles).
2. [Create a new Role](#custom-roles) or use an existing Role from the list.
3. Ensure that **Manage members**, **Read members**, and **Delete Organization** System Permissions are selected for the Role.
4. Open the three dots icon for the Role.
5. From the dropdown, select the **Set as Creator role** option.

### The **Default** Role for members

New Organization members are initially assigned the **Default** Role. By default, that Role is `org:member`. This Role is used as a pre-filled default in `<OrganizationProfile />` invitations and for Organization enrollment with [Verified Domains](https://clerk.com/docs/guides/organizations/add-members/verified-domains.md).

You cannot delete an Organization Role if it's used as the Organization's **Default** Role. But, you _can_ reassign the **Default** Role to any other Role.

To reassign the **Default** Role:

1. In the Clerk Dashboard, navigate to [**Roles & Permissions**](https://dashboard.clerk.com/~/organizations-settings/roles).
2. [Create a new Role](#custom-roles) or use an existing Role from the list.
3. Select the three dots next to the Role you want to set as default.
4. From the dropdown, select the **Set as Default role** option.

### Custom Roles

You can create up to 10 custom Organization Roles per application instance to meet your application needs. If you need more than 10 Roles, [contact support](https://clerk.com/contact/support){{ target: '_blank' }}.

Custom Roles can be granted Permissions and access. For example, you can create a new Role of **Billing** (`org:billing`) which can be used to group users who belong to a specific department of the Organization and have permission to manage credit card information, invoices, and other resources related to billing.

To create a new Role:

1. In the Clerk Dashboard, navigate to [**Roles & Permissions**](https://dashboard.clerk.com/~/organizations-settings/roles).
2. Select the **All roles** tab.
3. Select **Add role**.
4. Give the Role a name, a key to reference it by, and a description. The final key will follow the format `org:<role>`.
5. Select whether you want to include the role in the default Role Set.
6. Select **Save**.

> You must add the Role to a Role Set before members can be assigned this role. Refer to [Role Sets](https://clerk.com/docs/guides/organizations/control-access/role-sets.md) to learn more about controlling role availability.

### Change a user's Role

You can change a user's Role in the Clerk Dashboard or in your application using the [`<OrganizationSwitcher />`](https://clerk.com/docs/nextjs/reference/components/organization/organization-switcher.md) component.

> The Roles available in the dropdown are limited to those included in the Organization's assigned [Role Set](https://clerk.com/docs/guides/organizations/control-access/role-sets.md). If you need to assign a Role that's not available, you'll need to add that Role to the Organization's Role Set.

To change a user's Role in the Clerk Dashboard:

1. In the Clerk Dashboard, select [**Organizations**](https://dashboard.clerk.com/~/organizations) and select an organization.
2. Select the **Members** tab.
3. In the list of members, find the one whose Role you want to change.
4. Select another Role from their Role dropdown.

### Delete a Role

You cannot delete a Role that is still assigned to members of an Organization. Change the members to a different Role before completing the following steps.

1. In the Clerk Dashboard, navigate to [**Roles & Permissions**](https://dashboard.clerk.com/~/organizations-settings/roles).
2. Select the **All roles** tab.
3. Select the three dots icon next to the Role.
4. Select **Delete role**.

> You cannot delete any Roles currently assigned to one or more Organization members. If any Organization members currently have this Role, you'll need to reassign them first. Refer to [Role Sets](https://clerk.com/docs/guides/organizations/control-access/role-sets.md) for more information.

## Permissions

Permissions grant users privileged access to resources and operations, like creating and deleting. Clerk supports two types of Permissions: **System Permissions** and **Custom Permissions**.

### System Permissions

Clerk provides a set of System Permissions that power [Clerk's Frontend API](https://clerk.com/docs/reference/frontend-api.md){{ target: '_blank' }} and [`organization-related Clerk components`](https://clerk.com/docs/nextjs/reference/components/overview.md). These Permissions serve as the baseline required for Clerk to operate effectively.

Clerk's System Permissions consist of the following:

- Manage Organization (`org:sys_profile:manage`)
- Delete Organization (`org:sys_profile:delete`)
- Read members (`org:sys_memberships:read`)
- Manage members (`org:sys_memberships:manage`)
- Read domains (`org:sys_domains:read`)
- Manage domains (`org:sys_domains:manage`)
- Read billing (`org:sys_billing:read`)
- Manage billing (`org:sys_billing:manage`)

You can assign these System Permissions to any Role.

> System Permissions aren't included in [session claims](https://clerk.com/docs/guides/sessions/session-tokens.md#default-claims). If you need to check Permissions on the server-side, you must [create Custom Permissions](#custom-permissions) for authorization checks in your application code.

### Custom Permissions

Custom Permissions let you define fine-tuned access control within your Organization. Each Permission is tied to a Feature, and can be assigned to one or more Roles. To create a Custom Permission, you must first create a Role (e.g. **sales**) and a Feature within that Role (e.g. **invoices**). Once both exist, you can define specific Permissions (e.g. **create**) related to that Feature. To assign a Custom Permission to a user, you must assign the user to the Role that has the Permission.

To create a new Permission:

1. In the Clerk Dashboard, navigate to [**Roles & Permissions**](https://dashboard.clerk.com/~/organizations-settings/roles).
2. [Create a new Role](#custom-roles) or use an existing Role from the list.
3. Under **Custom permissions**, select **Create permission** under the Feature you want to create the Permission for. If there are no Features, you'll need to create a new one first. Select **Create feature** and fill in the required fields. Once finished, the newly created Feature will appear in the list, and the **Create permission** button will appear.
4. Give the Permission a name, a key to reference it by, and a description. The final key will follow the format `org:<feature>:<permission>`.
   > Common Permission values could be:
   >
   > - `create` — to allow creating resources
   > - `read` — to allow reading/viewing resources
   > - `update/manage` — to allow updating/editing resources
   > - `delete` — to allow deleting resources
   >
   > For example, you could create a new Permission called **Create invoices** (`org:invoices:create`) which allows only users with this Permission to edit invoices. Then, you could assign this Permission to a Role, or multiple Roles, such as **Billing** (`org:billing`) or **Sales** (`org:sales`).
5. Select **Create permission**.

You can also create a Custom Permission by navigating to the [**Features**](https://dashboard.clerk.com/~/features) tab in the Clerk Dashboard.

## Verify a user's Role or Permission

It's best practice to always verify whether or not a user is **authorized** to access sensitive information, important content, or exclusive features. **Authorization** is the process of determining the access rights and privileges of a user, ensuring they have the necessary Permissions to perform specific actions. To perform authorization checks using a user's Role or Permission, see the [guide on authorizing users](https://clerk.com/docs/guides/secure/authorization-checks.md).

## Next steps

Now that you've set up Roles and Permissions, you can:

- [Configure and assign Role Sets](https://clerk.com/docs/guides/organizations/control-access/role-sets.md): Learn how to configure and assign Role Sets to control which Roles are available to specific Organizations.
- [Perform authorization checks](https://clerk.com/docs/guides/secure/authorization-checks.md): Learn how to perform authorization checks to limit access to content or entire routes based on a user's Role or Permissions.
- [Configure Verified Domains](https://clerk.com/docs/guides/organizations/add-members/verified-domains.md): Learn how to automatically invite users to an Organization based on their email domain.
- [Add members to your Organization](https://clerk.com/docs/guides/organizations/add-members/invitations.md): Learn how to add members to your Organization with invitations.
- [Set up Enterprise SSO Connections](https://clerk.com/docs/guides/organizations/add-members/sso.md): Learn how to automatically add users to an Organization through Enterprise SSO.

# Role Sets

> This feature requires a [paid plan](https://clerk.com/pricing){{ target: '_blank' }} for production use, but all features are free to use in development mode so that you can try out what works for you. See the [pricing](https://clerk.com/pricing){{ target: '_blank' }} page for more information.

Role Sets are collections of available [Roles](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md) you can assign to members in an Organization. This lets you control role availability on a per-organization basis - if a Role isn't in an Organization's Role Set, members of that Organization can't be assigned to that Role.

When you create an Organization, it's automatically assigned to the **Default Role Set**. By default, this is set to Clerk's **Primary Role Set**, which includes the `admin` and `member` Roles. The Primary Role Set is free and can be modified to fit your needs. To create additional Role Sets with different combinations of Roles, you'll need the [**Enhanced B2B Authentication** add-on](https://clerk.com/pricing){{ target: '_blank' }}.

When you modify a Role Set, the changes are automatically applied to all Organizations using it. This makes it easy to roll out new Roles across multiple Organizations at once.

## When to use Role Sets

Use Role Sets when different Organizations need different available Roles. This works well for:

- **Different pricing tiers** - Your Free plan offers only `admin` and `member`, Pro adds `moderator` and `analyst`, and Enterprise adds `security_admin` and `compliance_officer`.
- **Different customer cohorts** - Small practices get `physician` and `nurse`, while large hospitals also get `department_head` and `specialist`. All cohorts share `admin` and `member`, but get additional Roles specific to their size.

If all Organizations need the same custom Roles, just modify the Primary Role Set instead. Refer to [Roles and Permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md) to learn how.

## Primary Role Set

The **Primary Role Set** is Clerk's default Role Set. It includes:

- **Admin (`org:admin`)** - Full access to Organization resources and management
- **Member (`org:member`)** - Limited access to Organization resources

You can add or remove Roles from it. If you remove a Role that members have, you'll go through the [remapping flow](#remapping-flow).

## Default Role Set

The **Default Role Set** determines which Role Set is automatically assigned to new Organizations. By default, this is configured to use the Primary Role Set, but you can change it to any other Role Set you've created.

To configure the Default Role Set:

1. In the Clerk Dashboard, navigate to [**Roles & Permissions**](https://dashboard.clerk.com/~/organizations-settings/roles).
2. Select the three dots next to the Role Set you want to set as default.
3. From the dropdown, select the **Set as default role set** option.
4. Confirm your changes.

> This only affects new Organizations. Existing Organizations keep their current Role Set unless you manually change them.

## Create a Role Set

To create additional Role Sets beyond the Primary Role Set, you'll need the [**Enhanced B2B Authentication** add-on](https://clerk.com/pricing){{ target: '_blank' }}.

To create a Role Set:

1. In the Clerk Dashboard, navigate to [**Roles & Permissions**](https://dashboard.clerk.com/~/organizations-settings/roles).
2. Select **Create role set**.
3. Give the Role Set a name, a key to reference it by, and a description.
4. Under **Roles**, click **Add Roles**. You can select from a list of global Roles or create new ones. You must also select a **Organization creator role** and a **New member default role**.
5. Select **Save**.

## Assign a Role Set to an Organization

You can assign a different Role Set to an organization to change which Roles are available to its members.

To assign a Role Set:

1. Navigate to [**Organizations**](https://dashboard.clerk.com/~/organizations) in the Clerk Dashboard and select an Organization.
2. Select the **Settings** tab.
3. Under **Roles**, you'll see the current Role Set (the Primary Role Set by default).
4. Choose a new Role Set from the dropdown.
5. If members have Roles that don't exist in the new set, you'll go through the [remapping flow](#remapping-flow).
6. Select **Confirm**.

## Edit a Role Set

When you edit a Role Set, the changes are automatically applied to all Organizations using it.

To edit a Role Set:

1. In the Clerk Dashboard, navigate to [**Roles & Permissions**](https://dashboard.clerk.com/~/organizations-settings/roles).
2. Select the Role Set you want to edit.

To add Roles, click **Add Roles**. You can select from a list of global Roles or create new ones. You must also select a **Organization creator role** and a **New member default role**.

To remove Roles, click on the three dots next to a Role and select **Remove role**. Confirm this change by typing the role name and clicking **Next**. If you remove a Role that members have, you will go through the [remapping flow](#remapping-flow). If you delete a default Role, the reassigned Role will be the new default Role.

> Removing a Role affects **all Organizations** using that Role Set. To remove a Role from just one Organization, create a new Role Set for it instead.

## Delete a Role Set

To delete a Role Set:

1. In the Clerk Dashboard, navigate to [**Roles & Permissions**](https://dashboard.clerk.com/~/organizations-settings/roles).
2. Select the **Role sets** tab.
3. Select the three dots next to the Role Set.
4. Select **Delete role set**.
5. If Organizations are using this Role Set, you'll be prompted to select a replacement Role Set for them. You will go through the [remapping flow](#remapping-flow).
6. Confirm by typing the Role Set key.

## Remapping flow

If you modify a Role that members have, you'll be prompted to select a replacement Role. This happens when you:

- Change an Organization's Role Set to one that doesn't include all current Roles.
- Remove a Role from a Role Set that members have.
- Delete a Role Set assigned to an Organization. Once you select a replacement Role Set, Clerk will prompt you to select replacement Roles.

**Example:**

Your Organization uses the "Basic Role Set" with `admin`, `member`, and `viewer`. You switch to the "Advanced Role Set" with `admin`, `member`, `moderator`, and `analyst`.

Since `viewer` doesn't exist in Advanced, you need to remap those members:

1. Select which Role they should receive (e.g., `member`).
2. Click **Remap roles** to confirm and Clerk will remap `viewer` members to `members`.

## Next steps

Now that you've learned about Role Sets, you can:

- [Set up Roles and Permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md): Learn how to create Roles and Permissions to include in Role Sets.
- [Check access](https://clerk.com/docs/guides/organizations/control-access/check-access.md): Learn how to check access based on Roles and Permissions.
- [Add members to your Organization](https://clerk.com/docs/guides/organizations/add-members/invitations.md): Learn how to add members to your Organization with invitations.

# Check Roles and Permissions with Authorization Checks

Authorization checks are checks you perform in your code to determine the access rights and privileges of a user, ensuring they have the necessary Permissions to perform specific actions or access certain content. These checks are essential for protecting sensitive data, gating premium features, and ensuring users stay within their allowed scope of access.

Within Organizations, authorization checks can be performed by checking a user's Roles or Custom Permissions. Roles like `org:admin` determine a user's level of access within an Organization, while Custom Permissions like `org:invoices:create` provide fine-grained control over specific features and actions.

## Examples

For examples on how to perform authorization checks, see the [guide on authorization checks](https://clerk.com/docs/guides/secure/authorization-checks.md).

**Client-side**

You can protect content and even entire routes based on Organization membership, Roles, and Permissions by performing authorization checks.

In the following example, the page is restricted to authenticated users, users who have the `org:admin` Role, and users who belong to the `Acme Corp` Organization.

- The [`Auth`](https://clerk.com/docs/reference/backend/types/auth-object.md) object is used to access the `isSignedIn` property and `has()` method.
- The `isSignedIn` property is used to check if the user is signed in.
- The `has()` method is used to check if the user has the `org:admin` Role.
- The [`useOrganization()`](https://clerk.com/docs/nextjs/reference/hooks/use-organization.md) hook is used to access the organization data.
- The Organization name is checked to ensure it matches the required Organization name. If a user is not in the required Organization, the page will display a message and the [`<OrganizationSwitcher />`](https://clerk.com/docs/nextjs/reference/components/organization/organization-switcher.md) component will be rendered to allow the user to switch to the required Organization.

```tsx {{ filename: 'app/protected/page.tsx' }}
"use client";
import { OrganizationSwitcher, useAuth, useOrganization } from "@clerk/nextjs";

export default function Page() {
  // The `useAuth()` hook gives you access to properties like `isSignedIn` and `has()`
  const { isSignedIn, has } = useAuth();
  const { organization } = useOrganization();

  // Check if the user is authenticated
  if (!isSignedIn) {
    return <p>You must be signed in to access this page.</p>;
  }

  // Check if there is an Active Organization
  if (!organization) {
    return (
      <>
        <p>Set an Active Organization to access this page.</p>
        <OrganizationSwitcher />
      </>
    );
  }

  // Check if the user has the `org:admin` Role
  if (!has({ role: "org:admin" })) {
    return <p>You must be an admin to access this page.</p>;
  }

  // Check if Organization name matches (e.g., "Acme Corp")
  const requiredOrgName = "Acme Corp";
  if (organization.name !== requiredOrgName) {
    return (
      <>
        <p>
          This page is only accessible in the <strong>{requiredOrgName}</strong>{" "}
          Organization. Switch to the <strong>{requiredOrgName}</strong>{" "}
          Organization to access this page.
        </p>
        <OrganizationSwitcher />
      </>
    );
  }

  return (
    <p>
      You are currently signed in as an <strong>admin</strong> in the{" "}
      <strong>{organization.name}</strong> Organization.
    </p>
  );
}
```

For more examples on how to perform authorization checks, see the [dedicated guide](https://clerk.com/docs/guides/secure/authorization-checks.md).

**Server-side**

You can protect content and even entire routes based on Organization membership, Roles, and Permissions by performing authorization checks.

In the following example, the page is restricted to authenticated users, users who have the `org:admin` Role, and users who belong to the `Acme Corp` Organization.

- The [`Auth`](https://clerk.com/docs/reference/backend/types/auth-object.md) object is used to access the `isAuthenticated` and `orgId` properties, as well as the `has()` method.
- The `isAuthenticated` property is used to check if the user is authenticated.
- The `orgId` property is used to check if there is an Active Organization.
- The `has()` method is used to check if the user has the `org:admin` Role.
- To fetch the Organization server-side, the [`clerkClient()`](https://clerk.com/docs/reference/nextjs/overview.md#clerk-client) helper is used to access the [`getOrganization()`](https://clerk.com/docs/reference/backend/organization/get-organization.md) method.
- The Organization name is checked to ensure it matches the required Organization name. If a user is not in the required Organization, the page will display a message and the [`<OrganizationSwitcher />`](https://clerk.com/docs/nextjs/reference/components/organization/organization-switcher.md) component will be rendered to allow the user to switch to the required Organization.

This example is written for Next.js App Router, but can be adapted to other frameworks by using the appropriate method for accessing the [`Auth` object](https://clerk.com/docs/reference/backend/types/auth-object.md), and the appropriate initialization for `clerkClient()`.

```tsx {{ filename: 'app/protected/page.tsx' }}
import { auth, clerkClient } from "@clerk/nextjs/server";
import { OrganizationSwitcher } from "@clerk/nextjs";

export default async function Page() {
  // The `Auth` object gives you access to properties like `isAuthenticated` and `userId`
  // Accessing the `Auth` object differs depending on the SDK you're using
  // https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object
  const { isAuthenticated, orgId, has } = await auth();

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <p>You must be signed in to access this page.</p>;
  }

  // Check if there is an Active Organization
  if (!orgId) {
    return (
      <>
        <p>Set an Active Organization to access this page.</p>
        <OrganizationSwitcher />
      </>
    );
  }

  // Check if the user has the `org:admin` Role
  if (!has({ role: "org:admin" })) {
    return <p>You must be an admin to access this page.</p>;
  }

  // To fetch the Active Organization server-side,
  // first initialize the JS Backend SDK.
  // This varies depending on the SDK you're using
  // https://clerk.com/docs/js-backend/getting-started/quickstart
  // Then use the `clerkClient()` to access the `getOrganization()` method
  const client = await clerkClient();
  const organization = await client.organizations.getOrganization({
    organizationId: orgId,
  });

  // Check if Organization name matches (e.g., "Acme Corp")
  const requiredOrgName = "Acme Corp";
  if (organization.name !== requiredOrgName) {
    return (
      <>
        <p>
          This page is only accessible in the <strong>{requiredOrgName}</strong>{" "}
          Organization. Switch to the <strong>{requiredOrgName}</strong>{" "}
          Organization to access this page.
        </p>
        <OrganizationSwitcher />
      </>
    );
  }

  return (
    <p>
      You are currently signed in as an <strong>admin</strong> in the{" "}
      <strong>{organization.name}</strong> Organization.
    </p>
  );
}
```

For more examples on how to perform authorization checks, see the [dedicated guide](https://clerk.com/docs/guides/secure/authorization-checks.md).

## Next steps

Now that you know how to check Roles and Permissions, you can:

- [Perform authorization checks](https://clerk.com/docs/guides/secure/authorization-checks.md): Learn how to perform authorization checks to limit access to content or entire routes based on a user's Role or Permissions.
- [Features and Plans](https://clerk.com/docs/guides/billing/for-b2b.md#control-access-with-features-plans-and-permissions): Learn how to check Features and Plans for Subscription-based applications.
- [Set up Roles and Permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md): Learn how to set up Roles and Permissions to control what invited users can access.
- [Configure default Roles](https://clerk.com/docs/guides/organizations/configure.md#default-roles): Learn how to configure default Roles for new Organization members.

# Organization metadata

Organization metadata lets you store custom information about an Organization that is not part of the standard fields, such as custom attributes that are specific to your application. This is useful for advanced user segmentation, analytics, or storing application-specific data like subscription tier, department, or region.

Metadata is stored on the [`Organization`](https://clerk.com/docs/reference/javascript/organization.md) and [`OrganizationMembership`](https://clerk.com/docs/reference/javascript/types/organization-membership.md) objects.

## Types of metadata

There are two types of Organization metadata: **public** and **private**.

| Metadata | Frontend API            | Backend API         |
| -------- | ----------------------- | ------------------- |
| Public   | Read access             | Read & write access |
| Private  | No read or write access | Read & write access |

Both the [`Organization`](https://clerk.com/docs/reference/javascript/organization.md) and [`OrganizationMembership`](https://clerk.com/docs/reference/javascript/types/organization-membership.md) objects have the metadata fields: `publicMetadata` and `privateMetadata`.

- Use the `publicMetadata` property if you need to set some metadata from your backend and have them displayed as read-only on the frontend.
- Use the `privateMetadata` property if the custom attributes contain sensitive information that should not be displayed on the frontend.

## Set Organization metadata

You can set Organization metadata in the [Clerk Dashboard](https://dashboard.clerk.com/~/organizations) or using Clerk's Backend API. See the [`updateOrganizationMetadata()`](https://clerk.com/docs/reference/backend/organization/update-organization-metadata.md) and [`updateOrganizationMembershipMetadata()`](https://clerk.com/docs/reference/backend/organization/update-organization-membership-metadata.md) methods for more information.

## Access public metadata

To access public metadata on the frontend, it's available on the [`Organization`](https://clerk.com/docs/reference/javascript/organization.md) object, which can be accessed using the [`useOrganization()`](https://clerk.com/docs/nextjs/reference/hooks/use-organization.md) hook.

To access public metadata on the backend, it's available on the [Backend `Organization`](https://clerk.com/docs/reference/backend/types/backend-organization.md) object which can be accessed using the [`getOrganization()`](https://clerk.com/docs/reference/backend/organization/get-organization.md) method. This method will return the `Organization` object which contains the public metadata. However, this method is subject to [rate limits](https://clerk.com/docs/guides/how-clerk-works/system-limits.md#backend-api-requests), so _if you are accessing the metadata frequently_, it's recommended to [attach it to the user's session token](#metadata-in-the-session-token).

## Metadata in the session token

Retrieving metadata from the `Organization` or `OrganizationMembership` objects on the server-side requires making an API request to Clerk's Backend API, which is slower and is subject to [rate limits](https://clerk.com/docs/guides/how-clerk-works/system-limits.md#backend-api-requests). You can store it in the user's session token, which doesn't require making an API request as it's available on the user's authentication context. **However, there is a size limitation to keep in mind.** Clerk stores the session token in a cookie, and most browsers cap cookie size at [**4KB**](https://datatracker.ietf.org/doc/html/rfc2109#section-6.3). After accounting for the size of Clerk's default claims, the cookie can support **up to 1.2KB** of custom claims. **Exceeding this limit will cause the cookie to not be set, which will break your app as Clerk depends on cookies to work properly.**

If you need to store more than 1.2KB of metadata, you should [store the extra data in your own database](https://clerk.com/docs/guides/development/webhooks/syncing.md#storing-extra-user-data) instead. If this isn't an option, you can [move particularly large claims out of the token](https://clerk.com/docs/guides/sessions/session-tokens.md#example) and fetch them using a separate API call from your backend, but this approach brings back the issue of making an API request to Clerk's Backend API, which is slower and is subject to rate limits.

Another limitation of storing metadata in the session token is that when you modify metadata server-side, the changes won't appear in the session token until the next refresh. To avoid race conditions, either [force a JWT refresh](https://clerk.com/docs/guides/sessions/force-token-refresh.md) after metadata changes or handle the delay in your application logic.

If you've considered the limitations, and you still want to store metadata in the session token:

1. In the Clerk Dashboard, navigate to the [**Sessions**](https://dashboard.clerk.com/~/sessions) page.
2. Under **Customize session token**, in the **Claims** editor, you can add any claim to your session token that you need and select **Save**. To avoid exceeding the session token's 1.2KB limit, it's not recommended to add the entire `organization.public_metadata` or `organization_membership.public_metadata` object. Instead, add individual fields as claims, like `organization.public_metadata.birthday`. When doing this, it's recommended to leave particularly large claims out of the token to avoid exceeding the session token's size limit. See the [example](https://clerk.com/docs/guides/sessions/session-tokens.md#example) for more information.

## Next steps

Now that you understand Organization metadata, you can:

- [Add metadata to invitations](https://clerk.com/docs/guides/organizations/add-members/invitations.md#invitation-metadata): Learn how to add metadata to invitations to track invitation sources or assign attributes.
- [Create and manage Organizations](https://clerk.com/docs/guides/organizations/create-and-manage.md): Learn how to create and manage Organizations to see metadata in action.
- [Control access based on Roles and Permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions.md): Learn how to configure access control with Custom Roles and Permissions.
- [Use Organization slugs in URLs](https://clerk.com/docs/guides/organizations/org-slugs-in-urls.md): Learn how to use Organization slugs in URLs for tenant-specific routing.

# Use Organization slugs in URLs

**Example Repository**

- [Demo app](https://github.com/clerk/orgs/tree/main/examples/sync-org-with-url)

**Before you start**

- [Set up a Next.js + Clerk app](https://clerk.com/docs/nextjs/getting-started/quickstart.md)
- [Enable Organizations for your instance](https://clerk.com/docs/guides/organizations/overview.md)
- [Enable Organization slugs for your application](https://clerk.com/docs/guides/organizations/configure.md#organization-slugs)

Organization slugs are human-readable URL identifiers (like `acme-corp` or `marketing-team`) that help users reference which Organization they're working in. A common pattern for Organization-scoped areas in an application is to include the Organization slug in the URL path, making links sharable and providing clear context about which tenant the page belongs to.

For example, a B2B application named "Petstore" has two customer Organizations: **Acmecorp** and **Widgetco**. Each Organization uses its name as a slug in the URL:

- **Acmecorp**: `https://petstore.example.com/orgs/`**`acmecorp`**`/dashboard`
- **Widgetco**: `https://petstore.example.com/orgs/`**`widgetco`**`/dashboard`

Alternatively, [Organization IDs](https://clerk.com/docs/reference/javascript/organization.md#properties) can be used to identify Organizations in URLs:

- **Acmecorp**: `https://petstore.example.com/orgs/`**`org_1a2b3c4d5e6f7g8e`**`/dashboard`
- **Widgetco**: `https://petstore.example.com/orgs/`**`org_1a2b3c4d5e6f7g8f`**`/dashboard`

### When to use Organization slugs

This feature is intended for apps that **require** Organization slugs in URLs. **We don't recommend adding slugs to URLs unless necessary.**

Use Organization slugs if:

- Users frequently share links for public-facing content (e.g., documentation, marketing materials, and third-party blogs).
- Users regularly switch between multiple Organizations.
- Organization-specific URLs provide meaningful context.

**Don't** use Organization slugs if:

- Most users belong to only one Organization.
- You want to keep URLs simple and consistent.
- You're primarily using the Clerk session for Organization context.

This guide shows you how to add Organization slugs to your app's URLs, configure Clerk components to handle slug-based navigation, and access Organization data based on the URL slug at runtime.

1. ## Configure `<OrganizationSwitcher />` and `<OrganizationList />`

   The [`<OrganizationSwitcher />`](https://clerk.com/docs/nextjs/reference/components/organization/organization-switcher.md) and [`<OrganizationList />`](https://clerk.com/docs/nextjs/reference/components/organization/organization-list.md) components provide a robust set of options to manage Organization slugs and IDs in your application's URLs.

   Set the following properties to configure the components to handle slug-based navigation:
   - Set `hideSlug` to `false` to allow users to customize the Organization's URL slug when creating an Organization.
   - Set `afterCreateOrganizationUrl` to `/orgs/:slug` to navigate the user to the Organization's slug after creating an Organization.
   - Set `afterSelectOrganizationUrl` to `/orgs/:slug` to navigate the user to the Organization's slug after selecting it.

   For example, if the Organization has the slug `acmecorp`, when a user creates or selects that Organization using either component, they'll be redirected to `/orgs/acmecorp`.

   **<OrganizationSwitcher />**

   ```tsx {{ filename: 'components/Header.tsx' }}
   import { OrganizationSwitcher } from "@clerk/nextjs";

   export default function Header() {
     return (
       <OrganizationSwitcher
         hideSlug={false} // Allow users to customize the org's URL slug
         afterCreateOrganizationUrl="/orgs/:slug" // Navigate to the org's slug after creating an org
         afterSelectOrganizationUrl="/orgs/:slug" // Navigate to the org's slug after selecting  it
       />
     );
   }
   ```

   **<OrganizationList />**

   ```tsx {{ filename: 'app/organization-list/[[...organization-list]]/page.tsx' }}
   import { OrganizationList } from "@clerk/nextjs";

   export default function OrganizationListPage() {
     return (
       <OrganizationList
         hideSlug={false} // Allow users to customize the org's URL slug
         afterCreateOrganizationUrl="/orgs/:slug" // Navigate to the org's slug after creating an org
         afterSelectOrganizationUrl="/orgs/:slug" // Navigate to the org's slug after selecting it
       />
     );
   }
   ```

2. ## Configure `clerkMiddleware()` to set the Active Organization

   > If your app doesn't use `clerkMiddleware()`, or you prefer to manually set the Active Organization, use the [`setActive()`](https://clerk.com/docs/reference/javascript/clerk.md) method to control the Active Organization on the client-side.

   With [`clerkMiddleware()`](https://clerk.com/docs/reference/nextjs/clerk-middleware.md), you can use the [`organizationSyncOptions`](https://clerk.com/docs/reference/nextjs/clerk-middleware.md#organization-sync-options) property to declare URL patterns that determine whether a specific Organization should be activated.

   If the middleware detects one of these patterns in the URL and finds that a different Organization is active in the session, it'll attempt to set the specified Organization as the active one.

   In the following example, two `organizationPatterns` are defined: one for the root (e.g., `/orgs/acmecorp`) and one as the wildcard matcher `(.*)` to match `/orgs/acmecorp/any/other/resource`. This configuration ensures that the path `/orgs/:slug` with any optional trailing path segments will set the Organization indicated by the slug as the active one.

   > If no Organization with the specified slug exists, or if the user isn't a member of the Organization, then `clerkMiddleware()` **won't** modify the Active Organization. Instead, it will leave the previously Active Organization unchanged on the Clerk session.

   ```tsx {{ filename: 'proxy.ts', mark: [[7, 13]] }}
   import { clerkMiddleware } from "@clerk/nextjs/server";

   export default clerkMiddleware(
     (auth, req) => {
       // Add your middleware checks
     },
     {
       organizationSyncOptions: {
         organizationPatterns: [
           "/orgs/:slug", // Match the org slug
           "/orgs/:slug/(.*)", // Wildcard match for optional trailing path segments
         ],
       },
     },
   );

   export const config = {
     matcher: [
       // Skip Next.js internals and all static files, unless found in search params
       "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
       // Always run for API routes
       "/(api|trpc)(.*)",
     ],
   };
   ```

3. ### Handle failed activation

   Now that `clerkMiddleware()` is configured to activate Organizations, you can build an Organization-specific page while handling cases where the Organization can't be activated.

   Failed activation occurs if no Organization with the specified slug exists, or if the given user isn't a member of the Organization. When this happens, the middleware won't change the Active Organization, leaving the previously active one unchanged.

   For troubleshooting, Clerk will also log a message on the server:

   > Clerk: Organization activation handshake loop detected. This is likely due to an invalid Organization ID or slug. Skipping Organization activation.

   It's ultimately the responsibility of the page to ensure that it renders the appropriate content for a given URL, and to handle the case where the expected Organization **isn't** active.

   In the following example, the Organization slug is detected as a Next.js [Dynamic Route](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes) param and passed as a parameter to the page. If the slug doesn't match the Active Organization slug, an error message is rendered and the [`<OrganizationList />`](https://clerk.com/docs/nextjs/reference/components/organization/organization-list.md) component allows the user to select a valid Organization.

   ```tsx {{ filename: 'app/orgs/[slug]/page.tsx' }}
   import { auth } from "@clerk/nextjs/server";
   import { OrganizationList } from "@clerk/nextjs";

   export default async function Home({
     params,
   }: {
     params: { slug: string };
   }) {
     const { orgSlug } = await auth();
     const { slug } = await params;

     // Check if the org slug from the URL params doesn't match
     // the active org slug from the user's session.
     // If they don't match, show an error message and the list of valid Organizations.
     if (slug != orgSlug) {
       return (
         <>
           <p>Sorry, Organization {slug} is not valid.</p>
           <OrganizationList
             hideSlug={false}
             afterCreateOrganizationUrl="/orgs/:slug"
             afterSelectOrganizationUrl="/orgs/:slug"
           />
         </>
       );
     }

     return <div>Welcome to Organization {orgSlug}</div>;
   }
   ```

4. ## Render Organization-specific content

   Use the following tabs to learn how to access Organization information on the server-side and client-side.

   **Server-side**

   To get Organization information on the server-side, access the [`Auth`](https://clerk.com/docs/reference/backend/types/auth-object.md) object which includes the active org's `orgId` and `orgSlug` and the current user's `orgRole` and `orgPermissions`. To access _additional_ Organization information server-side, like the Organization name, you can store the additional information in the user's session token. To [customize the session token](https://clerk.com/docs/guides/sessions/customize-session-tokens.md), do the following:
   1. In the Clerk Dashboard, navigate to the [**Sessions**](https://dashboard.clerk.com/~/sessions) page.
   2. Under **Customize session token**, in the **Claims** editor, add any claim you need to your session token. For this guide, add the following claim:

      ```json
      {
        "org_name": "{{org.name}}"
      }
      ```

   3. Select **Save**.

   Now that you've added the claim to the session token, you can access it from the [`sessionClaims`](https://clerk.com/docs/reference/backend/types/auth-object.md) property on the `Auth` object.

   ```tsx {{ filename: 'app/orgs/[slug]/page.tsx', mark: [[24, 25]] }}
   import { auth } from "@clerk/nextjs/server";
   import { OrganizationList } from "@clerk/nextjs";

   export default async function Home({
     params,
   }: {
     params: { slug: string };
   }) {
     const { orgSlug, sessionClaims } = await auth();
     const { slug } = await params;

     // Check if the org slug from the URL params doesn't match
     // the active org slug from the user's session.
     // If they don't match, show an error message and the list of valid Organizations.
     if (slug != orgSlug) {
       return (
         <>
           <p>Sorry, Organization {slug} is not valid.</p>
           <OrganizationList
             hideSlug={false}
             afterCreateOrganizationUrl="/orgs/:slug"
             afterSelectOrganizationUrl="/orgs/:slug"
           />
         </>
       );
     }

     // Access the org name from the session claims
     let orgId = sessionClaims["org_id"] as string;

     return <div>{orgId && `Welcome to organization ${orgId}`}</div>;
   }
   ```

   **Client-side**

   To get Organization information on the client-side, use the [`useOrganization()`](https://clerk.com/docs/nextjs/reference/hooks/use-organization.md) hook to access the [`organization`](https://clerk.com/docs/reference/javascript/organization.md) object.

   ```tsx {{ filename: 'app/orgs/[slug]/page.tsx', mark: [[27, 28]] }}
   "use client";

   import { OrganizationList, useOrganization } from "@clerk/nextjs";

   export default function Home({ params }: { params: { slug: string } }) {
     // Use `useOrganization()` to access the currently active org's `Organization` object
     const { organization } = useOrganization();

     // Check if the org slug from the URL params doesn't match
     // the active org slug from the user's session.
     // If they don't match, show an error message and the list of valid Organizations.
     if (!organization || organization.slug != params.slug) {
       return (
         <>
           <p>Sorry, Organization {params.slug} is not valid.</p>
           <OrganizationList
             hidePersonal={false}
             hideSlug={false}
             afterCreateOrganizationUrl="/orgs/:slug"
             afterSelectOrganizationUrl="/orgs/:slug"
             afterSelectPersonalUrl="/me"
           />
         </>
       );
     }

     // Access the org name from the `Organization` object
     return (
       <div>
         {organization && `Welcome to Organization ${organization.name}`}
       </div>
     );
   }
   ```

# <TaskChooseOrganization /> component

The `<TaskChooseOrganization />` component renders a UI for resolving the `choose-organization` session task. You can further customize your `<TaskChooseOrganization />` component by passing additional [`properties`](https://clerk.com/docs/nextjs/reference/components/authentication/task-choose-organization.md#properties) at the time of rendering.

> The `<TaskChooseOrganization/>` component cannot render when a user doesn't have current session tasks.

## When to use `<TaskChooseOrganization />`

Clerk's sign-in flows, such as the [Sign-in Account Portal page](https://clerk.com/docs/guides/account-portal/overview.md#sign-in), [`<SignInButton />`](https://clerk.com/docs/nextjs/reference/components/unstyled/sign-in-button.md), and [`<SignIn />`](https://clerk.com/docs/nextjs/reference/components/authentication/sign-in.md) component, automatically handle the `choose-organization` session task flow for you, including rendering the `<TaskChooseOrganization />` component when needed.

If you want to customize the route where the `<TaskChooseOrganization />` component is rendered or customize its appearance, you can host it yourself within your application.

## Example

The following example demonstrates how to host the `<TaskChooseOrganization />` component on a custom page. You first need to [set the `taskUrls` option on your Clerk integration](https://clerk.com/docs/guides/configure/session-tasks.md#using-the-task-urls-option) so that users are redirected to the page where you host the `<TaskChooseOrganization />` component when they have a pending `choose-organization` session task.

```tsx {{ filename: 'app/layout.tsx', mark: [7] }}
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider
          taskUrls={{
            "choose-organization": "/session-tasks/choose-organization",
          }}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
```

```tsx {{ filename: 'app/session-tasks/choose-organization/page.tsx' }}
import { TaskChooseOrganization } from "@clerk/nextjs";

export default function Page() {
  return <TaskChooseOrganization redirectUrlComplete="/dashboard" />;
}
```

## Properties

| Name                | Type       | Description                                                                 |
| ------------------- | ---------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| redirectUrlComplete | string     | The full URL or path to navigate to after successfully completing the task. |
| appearance?         | Appearance | undefined                                                                   | Optional object to style your components. Will only affect Clerk components and not Account Portal pages. |

## Customization

To learn about how to customize Clerk components, see the [`customization documentation`](https://clerk.com/docs/nextjs/guides/customizing-clerk/appearance-prop/overview.md).

If Clerk's prebuilt components don't meet your specific needs or if you require more control over the logic, you can rebuild the existing Clerk flows using the Clerk API. For more information, see the [custom flow guides](https://clerk.com/docs/guides/development/custom-flows/overview.md).

# <CreateOrganization /> component

The `<CreateOrganization />` component is used to render an Organization creation UI that allows users to create brand new Organizations in your application.

## Example

The following example includes a basic implementation of the `<CreateOrganization />` component. You can use this as a starting point for your own implementation.

```jsx {{ filename: 'app/create-organization/[[...create-organization]]/page.tsx' }}
import { CreateOrganization } from "@clerk/nextjs";

export default function CreateOrganizationPage() {
  return <CreateOrganization />;
}
```

## Properties

All props are optional.

| Name                       | Type       | Description                                                                                                                                                                                 |
| -------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| appearance                 | Appearance | undefined                                                                                                                                                                                   | Optional object to style your components. Will only affect Clerk components and not Account Portal pages.                                                                   |
| afterCreateOrganizationUrl | string     | Full URL or path to navigate to after creating a new organization.                                                                                                                          |
| routing                    | 'hash'     | 'path'                                                                                                                                                                                      | The routing strategy for your pages. Defaults to 'path' for frameworks that handle routing, such as Next.js and Remix. Defaults to hash for all other SDK's, such as React. |
| path                       | string     | The path where the component is mounted on when routing is set to path. It is ignored in hash-based routing. For example: /create-organization.                                             |
| skipInvitationScreen       | boolean    | Hides the screen for sending invitations after an Organization is created. When left undefined, Clerk will automatically hide the screen if the number of max allowed members is equal to 1 |
| hideSlug                   | boolean    | Hides the optional slug field in the Organization creation screen.                                                                                                                          |
| fallback?                  | ReactNode  | An optional element to be rendered while the component is mounting.                                                                                                                         |

## Customization

To learn about how to customize Clerk components, see the [`customization documentation`](https://clerk.com/docs/nextjs/guides/customizing-clerk/appearance-prop/overview.md).

# <OrganizationProfile /> component

The `<OrganizationProfile />` component allows users to manage their Organization membership, security, and billing settings.

This component's **General** tab displays the Organization's information and the **Leave organization** button. Admins will be able to see the **Update profile** button, **Verified domains** section, and **Delete organization** button.

The **Members** tab shows the Organization's members along with their join dates and Roles. Admins will have the ability to invite a member, change a member's Role, or remove them from the Organization. Admins will have tabs within the **Members** tab to view the Organization's [invitations](https://clerk.com/docs/guides/organizations/add-members/invitations.md) and [requests](https://clerk.com/docs/guides/organizations/add-members/verified-domains.md#membership-requests).

The **Billing** tab displays the Plans and Features that are available to the Organization, as well as the user's billing information, such as their invoices and payment methods.

## Example

The following example includes a basic implementation of the `<OrganizationProfile />` component. You can use this as a starting point for your own implementation.

The `<OrganizationProfile />` component must be embedded using the [Next.js optional catch-all route](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes#optional-catch-all-routes) in order for the routing to work.

```jsx {{ filename: 'app/organization-profile/[[...organization-profile]]/page.tsx' }}
import { OrganizationProfile } from "@clerk/nextjs";

export default function OrganizationProfilePage() {
  return <OrganizationProfile />;
}
```

## Properties

The `<OrganizationProfile />` component accepts the following properties, all of which are **optional**:

| Name                      | Type          | Description                                                                                                                                                              |
| ------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| appearance                | Appearance    | undefined                                                                                                                                                                | Optional object to style your components. Will only affect Clerk components and not Account Portal pages.                                                                   |
| afterLeaveOrganizationUrl | string        | The full URL or path to navigate to after leaving an Organization.                                                                                                       |
| customPages               | CustomPages[] | An array of custom pages to add to the Organization profile. Only available for the JavaScript SDK. To add custom pages with React-based SDK's, see the dedicated guide. |
| fallback?                 | ReactNode     | An optional element to be rendered while the component is mounting.                                                                                                      |
| path                      | string        | The path where the component is mounted on when routing is set to path. It is ignored in hash- and virtual-based routing.For example: /organization-profile.             |
| routing                   | 'hash'        | 'path'                                                                                                                                                                   | The routing strategy for your pages. Defaults to 'path' for frameworks that handle routing, such as Next.js and Remix. Defaults to hash for all other SDK's, such as React. |

## Customization

To learn about how to customize Clerk components, see the [`customization documentation`](https://clerk.com/docs/nextjs/guides/customizing-clerk/appearance-prop/overview.md).

In addition, you also can add custom pages and links to the `<OrganizationProfile />` navigation sidenav. For more information, refer to the [`Custom Pages`](https://clerk.com/docs/nextjs/guides/customizing-clerk/adding-items/organization-profile.md) documentation.

# <OrganizationSwitcher /> component

The `<OrganizationSwitcher />` component allows a user to switch between their joined Organizations. If Personal Accounts are enabled, users can also switch to their Personal Account. This component is useful for applications that have a multi-tenant architecture, where users can be part of multiple Organizations. It handles all Organization-related flows, including full Organization management for admins. Learn more about [Organizations](https://clerk.com/docs/guides/organizations/overview.md).

## Example

The following example includes a basic implementation of the `<OrganizationSwitcher />` component. You can use this as a starting point for your own implementation.

```jsx {{ filename: 'app/organization-switcher/[[...organization-switcher]]/page.tsx' }}
import { OrganizationSwitcher } from "@clerk/nextjs";

export default function OrganizationSwitcherPage() {
  return <OrganizationSwitcher />;
}
```

## Properties

The `<OrganizationSwitcher />` component accepts the following properties, all of which are **optional**:

| Name                       | Type       | Description                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| afterCreateOrganizationUrl | string     | The full URL or path to navigate to after creating a new Organization.                                                                                                                                                                                                                                                                                                                                                                 |
| afterLeaveOrganizationUrl  | string     | The full URL or path to navigate to after the user leaves the currently Active OrganizationA user can be a member of multiple Organizations, but only one can be active at a time. The Active Organization determines which Organization-specific data the user can access and which Role and related Permissions they have within the Organization..                                                                                  |
| afterSelectOrganizationUrl | string     | The full URL or path to navigate to after a successful Organization switch.                                                                                                                                                                                                                                                                                                                                                            |
| afterSelectPersonalUrl     | string     | The full URL or path to navigate to after selecting the Personal AccountPersonal Accounts are individual workspaces that allow users to operate independently without belonging to an Organization. Learn more about Personal Accounts.. Defaults to undefined.                                                                                                                                                                        |
| appearance                 | Appearance | undefined                                                                                                                                                                                                                                                                                                                                                                                                                              | Optional object to style your components. Will only affect Clerk components and not Account Portal pages.                                                                                                                                                                            |
| createOrganizationMode     | 'modal'    | 'navigation'                                                                                                                                                                                                                                                                                                                                                                                                                           | A boolean that controls whether clicking the "Create organization" button will cause the <CreateOrganization /> component to open as a modal, or if the browser will navigate to the createOrganizationUrl where <CreateOrganization /> is mounted as a page. Defaults to: 'modal'.  |
| createOrganizationUrl      | string     | The full URL or path where the <CreateOrganization />]createorg-ref component is mounted.                                                                                                                                                                                                                                                                                                                                              |
| defaultOpen                | boolean    | A boolean that controls the default state of the <OrganizationSwitcher /> component.                                                                                                                                                                                                                                                                                                                                                   |
| fallback?                  | ReactNode  | An optional element to be rendered while the component is mounting.                                                                                                                                                                                                                                                                                                                                                                    |
| hidePersonal               | boolean    | A boolean that controls whether <OrganizationSwitcher /> will include the user's Personal AccountPersonal Accounts are individual workspaces that allow users to operate independently without belonging to an Organization. Learn more about Personal Accounts. in the Organization list. Setting this to true will hide the Personal Account option, and users will only be able to switch between Organizations. Defaults to false. |
| hideSlug                   | boolean    | A boolean that controls whether the optional slug field in the Organization creation screen is hidden.                                                                                                                                                                                                                                                                                                                                 |
| organizationProfileMode    | 'modal'    | 'navigation'                                                                                                                                                                                                                                                                                                                                                                                                                           | A boolean that controls whether clicking the Manage organization button will cause the <OrganizationProfile /> component to open as a modal, or if the browser will navigate to the organizationProfileUrl where <OrganizationProfile /> is mounted as a page. Defaults to: 'modal'. |
| organizationProfileProps   | object     | Specify options for the underlying <OrganizationProfile /> component. For example: {appearance: {...}}                                                                                                                                                                                                                                                                                                                                 |
| organizationProfileUrl     | string     | The full URL or path where the <OrganizationProfile /> component is mounted.                                                                                                                                                                                                                                                                                                                                                           |

## Customization

To learn about how to customize Clerk components, see the [`customization documentation`](https://clerk.com/docs/nextjs/guides/customizing-clerk/appearance-prop/overview.md).

[createorg-ref]: /docs/reference/components/organization/create-organization
[orgprofile-ref]: /docs/reference/components/organization/organization-profile

# <OrganizationList /> component

The `<OrganizationList />` component displays Organization-related memberships and automatic [invitations](https://clerk.com/docs/guides/organizations/add-members/verified-domains.md#automatic-invitations) and [suggestions](https://clerk.com/docs/guides/organizations/add-members/verified-domains.md#automatic-suggestions) for the user.

## Example

The following example includes a basic implementation of the `<OrganizationList />` component. You can use this as a starting point for your own implementation.

```jsx {{ filename: 'app/organizations/page.tsx' }}
import { OrganizationList } from "@clerk/nextjs";

export default function OrganizationListPage() {
  return (
    <OrganizationList
      afterCreateOrganizationUrl="/organization/:slug"
      afterSelectPersonalUrl="/user/:id"
      afterSelectOrganizationUrl="/organization/:slug"
    />
  );
}
```

## Properties

The `<OrganizationList />` component accepts the following properties, all of which are **optional**:

| Name                       | Type                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| afterCreateOrganizationUrl | ((org: Organization) => string) | string                                                                                                                                                                                                                                                                                                                                                                                                                             | The full URL or path to navigate to after creating a new Organization.                                                                                                                                                                                          |
| afterSelectOrganizationUrl | ((org: Organization) => string) | string                                                                                                                                                                                                                                                                                                                                                                                                                             | The full URL or path to navigate to after selecting an Organization. Defaults to undefined.                                                                                                                                                                     |
| afterSelectPersonalUrl     | ((org: Organization) => string) | string                                                                                                                                                                                                                                                                                                                                                                                                                             | The full URL or path to navigate to after selecting the Personal AccountPersonal Accounts are individual workspaces that allow users to operate independently without belonging to an Organization. Learn more about Personal Accounts.. Defaults to undefined. |
| appearance                 | Appearance                      | undefined                                                                                                                                                                                                                                                                                                                                                                                                                          | Optional object to style your components. Will only affect Clerk components and not Account Portal pages.                                                                                                                                                       |
| fallback?                  | ReactNode                       | An optional element to be rendered while the component is mounting.                                                                                                                                                                                                                                                                                                                                                                |
| hidePersonal               | boolean                         | A boolean that controls whether <OrganizationList /> will include the user's Personal AccountPersonal Accounts are individual workspaces that allow users to operate independently without belonging to an Organization. Learn more about Personal Accounts. in the Organization list. Setting this to true will hide the Personal Account option, and users will only be able to switch between Organizations. Defaults to false. |
| hideSlug                   | boolean                         | A boolean that controls whether the optional slug field in the Organization creation screen is hidden. Defaults to false.                                                                                                                                                                                                                                                                                                          |
| skipInvitationScreen       | boolean                         | undefined                                                                                                                                                                                                                                                                                                                                                                                                                          | A boolean that controls whether the screen for sending invitations after an Organization is created is hidden. When undefined, Clerk will automatically hide the screen if the number of max allowed members is equal to 1. Defaults to false.                  |

## Customization

To learn about how to customize Clerk components, see the [`customization documentation`](https://clerk.com/docs/nextjs/guides/customizing-clerk/appearance-prop/overview.md).

[org-ref]: /docs/reference/javascript/organization
