import { useEffect, useState } from "react";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import { GearIcon } from "@radix-ui/react-icons";

interface Task {
    id: number;
    title: string;
    description: string;
    is_completed: boolean;
    created_at: string;
    completed_at: string | null;
}

const TaskListPage = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<string>("");
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const pageSize = 10;

    useEffect(() => {
        fetchTasks();
    }, [filter, page]);

    const fetchTasks = async () => {
        try {
            const response = await api.get("/tasks/", {
                params: {
                    is_completed: filter,
                    page: page,
                    page_size: pageSize,
                },
            });

            console.log("Resposta da API:", response.data);

            const tasksData = response.data.results;
            const count = response.data.count;

            setTasks(tasksData);

            const calculatedTotalPages = Math.ceil(count / pageSize) || 1;
            setTotalPages(calculatedTotalPages);
        } catch (error) {
            console.error("Erro ao buscar tarefas:", error);
        }
    };

    const handleEdit = (id: number) => navigate(`/tasks/edit/${id}`);
    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/tasks/${id}/`);
            await fetchTasks();
        } catch (error) {
            console.error("Erro ao deletar tarefa:", error);
        }
    };

    const handleComplete = async (id: number) => {
        try {
            await api.patch(`/tasks/${id}/`, { is_completed: true });
            await fetchTasks();
        } catch (error) {
            console.error("Erro ao completar tarefa:", error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Tarefas</h1>
                <Button
                    onClick={() => navigate("/tasks/create")}
                    className="bg-blue-500 text-white"
                >
                    Nova Tarefa
                </Button>
            </div>

            <div className="flex justify-between items-center mb-4">
                <div>
                    <select
                        onChange={(e) => {
                            setFilter(e.target.value);
                            setPage(1);
                        }}
                        className="border rounded px-2 py-1"
                    >
                        <option value="">Todas</option>
                        <option value="true">Concluídas</option>
                        <option value="false">Não Concluídas</option>
                    </select>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Título</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Data de Criação</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>{task.description}</TableCell>
                            <TableCell>
                                {format(new Date(task.created_at), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell>
                                {task.is_completed ? "Concluída" : "Pendente"}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button>
                                            <GearIcon />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem onSelect={() => handleEdit(task.id)}>
                                            Editar
                                        </DropdownMenuItem>
                                        {!task.is_completed && (
                                            <DropdownMenuItem
                                                onSelect={() => handleComplete(task.id)}
                                            >
                                                Marcar como Concluída
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem onSelect={() => handleDelete(task.id)}>
                                            Remover
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {totalPages > 1 && (
                <Pagination className="mt-4">
                    <PaginationContent className="flex gap-4">
                        <PaginationItem>
                            <div
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                className={`cursor-pointer ${
                                    page === 1 ? "text-gray-400 cursor-not-allowed" : ""
                                }`}
                            >
                                <PaginationPrevious disabled={page === 1} />
                            </div>
                        </PaginationItem>

                        {[...Array(totalPages)].map((_, i) => (
                            <PaginationItem key={i}>
                                <div
                                    onClick={() => setPage(i + 1)}
                                    className={`cursor-pointer ${
                                        page === i + 1 ? "font-bold underline" : ""
                                    }`}
                                >
                                    {i + 1}
                                </div>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <div
                                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                                className={`cursor-pointer ${
                                    page === totalPages
                                        ? "text-gray-400 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                <PaginationNext disabled={page === totalPages} />
                            </div>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default TaskListPage;
