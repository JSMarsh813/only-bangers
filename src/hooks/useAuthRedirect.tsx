import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Account, Client, Models } from "appwrite";

/**
 useAuthRedirect: 
 
 //if user is already signed in, redirect to dashboard

//user wasn't signed in when they visted the login page, but they then logged in successfully? then redirect to dashboard (thus why we're listening for triggerRecheck to change)
 
 @param getUser - async function returning true if user is logged in
 //function getUser(): Promise<Models.User<Models.Preferences> | null>
 @param redirectPath - path to redirect to if logged in
 @param trigger - dependency to re-run the check

 //these params are part of JSDoc comments: 
✅ document what each parameter does
✅ help your editor (VS Code, WebStorm, etc) provide autocompletion + inline documentation
✅ clarify intent for future-you (or a confused teammate poking around six months from now)

TypeScript handles types, but JSDoc is still valuable because:

it adds human explanations (e.g., why you pass trigger, not just its type)

 shows up in IDE tooltips

 improves readability without opening the function definition

 🧙 TypeScript describes the rules.
📝 JSDoc describes the story.
 */
export function useAuthRedirect(
  getUser: () => Promise<Models.User<Models.Preferences> | null>,

  redirectPath: string = "/dashboard",

  trigger?: unknown,
): void {
  // typed trigger as unknown (since you could pass anything there)
  // returns as void, snce it doesn't return anything
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;
    //isMounted is a cancelation guard, if the component unmounts before  getUser() resolves, React might complain about “setting state on an unmounted component” (or a stale redirect). A simple flag fixes that
    // This avoids race conditions if triggerRecheck changes rapidly or the component goes away.

    async function check() {
      try {
        const loggedIn = await getUser();
        if (loggedIn && isMounted) {
          router.push(redirectPath);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    }

    check();

    return () => {
      isMounted = false;
    };
  }, [trigger, redirectPath, router, getUser]);
}
