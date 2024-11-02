import { useEffect, useState } from "react";
import api from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BeatLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import {
    Form,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const categoryFormSchema = z.object({
    name: z
        .string()
        .min(2, { message: "O nome deve ter pelo menos 2 caracteres." })
        .max(100, { message: "O nome pode ter no máximo 100 caracteres." }),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

interface Category {
    id: number;
    name: string;
}

const TaskCategoryPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [loadingForm, setLoadingForm] = useState<boolean>(false);

    const form = useForm<CategoryFormData>({
        resolver: zodResolver(categoryFormSchema),
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoadingCategories(true);
        try {
            const response = await api.get("/categories/");
            setCategories(response.data);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
            setError("Erro ao carregar categorias.");
        } finally {
            setLoadingCategories(false);
        }
    };

    const onSubmit = async (data: CategoryFormData) => {
        setLoadingForm(true);
        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory.id}/`, data);
                setEditingCategory(null);
            } else {
                await api.post("/categories/", data);
            }
            form.reset();
            fetchCategories();
        } catch (error) {
            console.error("Erro ao salvar a categoria:", error);
            setError("Erro ao salvar a categoria.");
        } finally {
            setLoadingForm(false);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        form.setValue("name", category.name);
    };

    const handleDelete = async (categoryId: number) => {
        if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
            try {
                await api.delete(`/categories/${categoryId}/`);
                fetchCategories();
            } catch (error) {
                console.error("Erro ao excluir a categoria:", error);
                setError("Erro ao excluir a categoria.");
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        form.reset();
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Gerenciar Categorias</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">
                    {editingCategory ? "Editar Categoria" : "Nova Categoria"}
                </h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome da categoria" {...form.register("name")} />
                            </FormControl>
                            <FormMessage>{form.formState.errors.name?.message}</FormMessage>
                        </FormItem>
                        <div className="flex items-center space-x-2">
                            <Button type="submit" variant="default" disabled={loadingForm}>
                                {loadingForm ? (
                                    <span className="flex items-center">
                    <BeatLoader size={8} color="#fff" />
                    <span className="ml-2">Salvando...</span>
                  </span>
                                ) : (
                                    "Salvar"
                                )}
                            </Button>
                            {editingCategory && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleCancelEdit}
                                >
                                    Cancelar
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-2">Categorias Existentes</h2>
                {loadingCategories ? (
                    <div className="flex justify-center py-10">
                        <BeatLoader />
                    </div>
                ) : error ? (
                    <div className="text-red-600 text-sm mb-4">{error}</div>
                ) : categories.length === 0 ? (
                    <div>Nenhuma categoria encontrada.</div>
                ) : (
                    <table className="w-full table-auto">
                        <thead>
                        <tr>
                            <th className="px-4 py-2 text-left">Nome</th>
                            <th className="px-4 py-2 text-right">Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="border-t">
                                <td className="px-4 py-2">{category.name}</td>
                                <td className="px-4 py-2 text-right">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => handleEdit(category)}
                                        className="mr-2"
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDelete(category.id)}
                                    >
                                        Excluir
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TaskCategoryPage;
