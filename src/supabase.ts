import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { navigate } from "wouter/use-browser-location";

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const supabaseAdmin = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

async function checkUser(type: "validate" | "return", navigateAway?: boolean) {
    const { data, error } = await supabase.auth.getUser();

    if (type === "validate") {
        if (error) {
            // redirect logic here
            !navigateAway ? navigate("/") : navigate("/login");
            return;
        }
    }

    // Returns true if the user is authenticated (i.e., user data exists and there is no error)
    return !!(data && !error);
}

async function logOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        toast.error("Error: " + error.message);
    } else {
        toast.success("Logged out successfully.");
        window.location.reload();
    }
}

export { supabase, supabaseAdmin,checkUser, logOut };
