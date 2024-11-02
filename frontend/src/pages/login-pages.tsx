"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAuth } from "../context/auth-context";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
    username: z
        .string()
        .min(2, { message: "Username must be at least 2 characters." })
        .max(50, { message: "Username must be at most 50 characters." }),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters." })
        .max(100, { message: "Password must be at most 100 characters." }),
});

type FormData = z.infer<typeof formSchema>;

const LoginPage = () => {
    const { login } = useAuth();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = async (data: FormData) => {
        await login(data.username, data.password);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="w-full max-w-md p-6 rounded-lg border border-border shadow-sm bg-card">
                <h1 className="text-2xl font-semibold text-center text-foreground mb-4">
                    Login
                </h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Your password"
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Login
                        </Button>
                    </form>
                </Form>
                <div className="text-sm text-center text-muted-foreground mt-4">
                    Don’t have an account?{" "}
                    <a href="/register" className="text-primary hover:underline">
                        Sign up
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
