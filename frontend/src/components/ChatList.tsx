import ChatCard from "./ChatCard";
import {
  useDeleteChatMutation,
  useJoinChatMutation,
  useLeaveChatMutation,
} from "../slices/chatApiSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface Chat {
  _id: string;
  name: string;
  imgUrl?: string;
  messages: any[];
  host?: string;
  users: any[];
  countries: string[];
  createdAt: string;
  authorId: string;
}

interface ChatListProps {
  chats: Chat[];
  onRefresh: any;
}

export default function ChatList({ chats, onRefresh }: ChatListProps) {
  const { userInfo } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const token = userInfo?.token;
  const userId = userInfo?.user.userId || userInfo?.user?._id;

  const [deleteChat] = useDeleteChatMutation();
  const [joinChat] = useJoinChatMutation();
  const [leaveChat] = useLeaveChatMutation();

  const handleJoin = async (chatId: string) => {
    try {
      await joinChat({ chatId, userId, token }).unwrap();
      onRefresh();
      window.location.reload();
    } catch (err) {
      console.error("Failed to join chat:", err);
    }
  }

  const handleLeave = async (chatId: string) => {
    try {
      await leaveChat({ chatId, userId, token }).unwrap();
      onRefresh();
      window.location.reload();
    } catch (err) {
      console.error("Failed to leave chat:", err);
    }
  }

  const handleEdit = (chatId: string) => {
    navigate(`/chat/${chatId}/edit`);
  };

  const handleDelete = async (chatId: string, hostId: string) => {
    const token = userInfo?.token;
    if (!window.confirm("Are you sure you want to delete this chat?")) return;

    try {
      await deleteChat({ chatId, hostId, token }).unwrap();
      alert("Chat deleted successfully");
      onRefresh();
    } catch (error) {
      console.error("Failed to delete chat", error);
    }
  };

  return (
    <div>
      {chats.map((chat: Chat) => (
        <ChatCard
          key={chat._id}
          id={chat._id}
          name={chat.name}
          imgUrl={chat.imgUrl}
          messageCount={chat.messages.length}
          userCount={chat.users.length}
          countries={chat.countries}
          createdAt={chat.createdAt}
          authorId={chat.authorId || chat.host || ""}
          onEdit={() => handleEdit(chat._id)}
          onDelete={() => handleDelete(chat._id, userId)}
          isMember={chat.users.includes(userId)}
          onJoin={() => handleJoin(chat._id)}
          onLeave={() => handleLeave(chat._id)}
        />
      ))}
    </div>
  );
}
