import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

interface Task {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
}

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      const response = await api.get<Task>(`/tasks/${id}/`);
      setTask(response.data);
    } catch (error) {
      console.error("Erro ao buscar a tarefa:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async () => {
    if (window.confirm("Tem certeza que deseja deletar esta tarefa?")) {
      try {
        await api.delete(`/tasks/${id}/`);
        navigate("/tasks");
      } catch (error) {
        console.error("Erro ao deletar a tarefa:", error);
      }
    }
  };

  const toggleCompletion = async () => {
    if (!task) return;
    try {
      await api.patch(`/tasks/${id}/`, {
        is_completed: !task.is_completed,
      });
      setTask({ ...task, is_completed: !task.is_completed });
    } catch (error) {
      console.error("Erro ao atualizar o status da tarefa:", error);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (!task) {
    return <p>Tarefa não encontrada.</p>;
  }

  return (
    <Card className="p-4">
      <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
      <p className="mb-4">{task.description}</p>
      <p className="mb-4">
        Status:{" "}
        <span className={task.is_completed ? "text-green-500" : "text-red-500"}>
          {task.is_completed ? "Concluída" : "Não Concluída"}
        </span>
      </p>
      <div className="flex space-x-2 mb-4">
        <Button onClick={toggleCompletion}>
          {task.is_completed
            ? "Marcar como Não Concluída"
            : "Marcar como Concluída"}
        </Button>
        <Button onClick={() => navigate(`/tasks/edit/${id}`)}>Editar</Button>
        <Button variant="destructive" onClick={deleteTask}>
          Deletar
        </Button>
      </div>
      <Link to="/tasks" className="text-blue-500 hover:underline">
        Voltar para a Lista de Tarefas
      </Link>
    </Card>
  );
};

export default TaskDetailPage;
