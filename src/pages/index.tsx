import { RootState } from "@/state/store";
import { useSelector } from "react-redux";

export default function Main() {
  const data = useSelector((state: RootState) => state.type_file).data;

  return null;
}
