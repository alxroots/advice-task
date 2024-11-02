import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import api from "../services/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/text-area";
import { BeatLoader } from "react-spinners";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/Select";

const taskFormSchema = z.object({
  title: z
      .string()
      .min(2, { message: "O título deve ter pelo menos 2 caracteres." })
      .max(100, { message: "O título pode ter no máximo 100 caracteres." }),
  description: z
      .string()
      .max(500, { message: "A descrição pode ter no máximo 500 caracteres." }),
  category: z.union([z.string(), z.number()]).optional(),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

const TaskFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: undefined,
    },
  });

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await api.get("/categories/");
      console.log("Categories data:", response.data);
      const categoriesData = Array.isArray(response.data) ? response.data : [];
      setCategories(categoriesData);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
      setCategories([]);
      setCategoriesError("Erro ao carregar categorias.");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchTask = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/tasks/${id}/`);
      form.setValue("title", response.data.title);
      form.setValue("description", response.data.description);
      form.setValue(
          "category",
          response.data.category ? response.data.category.toString() : undefined
      );
    } catch (error) {
      setError("Erro ao carregar a tarefa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: TaskFormData) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...data,
        category: data.category ? Number(data.category) : null,
      };

      if (id) {
        await api.put(`/tasks/${id}/`, payload);
      } else {
        await api.post("/tasks/", payload);
      }
      navigate("/tasks");
    } catch (error) {
      setError("Erro ao salvar a tarefa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/tasks");
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold">
              {id ? "Editar Tarefa" : "Nova Tarefa"}
            </h1>
            <Button
                onClick={handleBack}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300"
            >
              Voltar
            </Button>
          </div>
          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}
          {loading ? (
              <div className="flex justify-center py-10">
                <BeatLoader />
              </div>
          ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input
                          placeholder="Título da tarefa"
                          {...form.register("title")}
                      />
                    </FormControl>
                    <FormMessage>{form.formState.errors.title?.message}</FormMessage>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                          placeholder="Descrição da tarefa"
                          {...form.register("description")}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.description?.message}
                    </FormMessage>
                  </FormItem>

                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      {loadingCategories ? (
                          <div>Carregando categorias...</div>
                      ) : categoriesError ? (
                          <div className="text-red-600 text-sm mb-4">
                            {categoriesError}
                          </div>
                      ) : (
                          <Controller
                              name="category"
                              control={form.control}
                              render={({ field }) => (
                                  <Select
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                      }}
                                      value={field.value?.toString()}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {categories.map((category) => (
                                          <SelectItem
                                              key={category.id}
                                              value={category.id.toString()}
                                          >
                                            {category.name}
                                          </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                              )}
                          />
                      )}
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.category?.message}
                    </FormMessage>
                  </FormItem>

                  <Button type="submit" variant="default">
                    {loading ? "Salvando..." : "Salvar"}
                  </Button>
                </form>
              </Form>
          )}
        </div>
      </div>
  );
};

export default TaskFormPage;
