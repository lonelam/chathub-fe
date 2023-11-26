import React, { useState, useEffect } from "react";
import api from "api"; // Assuming this is your API configuration
import { useNavigate } from "react-router-dom"; // For navigation
import { FaPlus } from "react-icons/fa"; // For the plus icon
import { WechatAccount } from "api/types/accounts";
import Logo from "./logo.png";

export const EntryPage = () => {
  const [accounts, setAccounts] = useState<WechatAccount[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await api.get("wechat/accounts");
        setAccounts(response.data.data);
      } catch (error) {
        console.error("Error fetching accounts", error);
      }
    };

    fetchAccounts();
  }, []);

  const handleAccountClick = (accountId: string) => {
    navigate(`/chat/${accountId}`); // Navigate to the chat page with the account ID
  };

  const handleAddAccount = () => {
    navigate("/start");
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="mb-8 flex border p-4">
        <img src={Logo} alt="Logo" className="m-auto w-1/5" />
      </div>
      <div className="flex items-center justify-center">
        {accounts.map((account) => (
          <div
            key={account.wechatId}
            className="m-2 cursor-pointer rounded bg-slate-100 p-1 text-center shadow hover:bg-slate-200"
          >
            <img
              src={account.avatarUrl}
              alt={account.name}
              className={`cursor-pointer ${
                account.isLogin ? "ring-2 ring-green-500" : ""
              } w-16 rounded-full`}
              onClick={() => handleAccountClick(account.wechatId)}
            />
            <div
              key={account.wechatId}
              className={`m-2 cursor-pointer text-center ${
                account.isLogin ? "text-green-500" : ""
              }`}
              onClick={() => handleAccountClick(account.wechatId)}
            >
              {account.name}
            </div>
          </div>
        ))}
        <div className="m-2 text-center">
          <FaPlus
            size="2em"
            className="cursor-pointer"
            onClick={handleAddAccount}
          />
        </div>
      </div>
    </div>
  );
};
