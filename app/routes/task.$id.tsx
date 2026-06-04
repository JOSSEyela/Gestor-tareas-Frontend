import { useParams } from "react-router";

export default function TaskDetail() {
  const { id } = useParams()
  return <p>Task ID: {id}</p>
}
