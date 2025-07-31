import React, { useState } from "react";
import { useMyTeam, useLeaveTeam, useInviteToTeam } from "../hooks/useTeam";
import { useAuth } from "../contexts/AuthContext";

const TeamPage = () => {
  const { data: team, isLoading, error } = useMyTeam();
  const { user } = useAuth();
  const [email, setEmail] = useState("");

  const inviteMutation = useInviteToTeam();
  const leaveMutation = useLeaveTeam();

  if (isLoading) return <p>Loading team...</p>;
  if (error) return <p>Error loading team: {error.message}</p>;

  const members = team?.team?.members || [];
  const ownerId = team.team.owner._id;
  const isOwner = user._id === ownerId;

  const handleInvite = (e) => {
    e.preventDefault();
    if (!email) return;
    inviteMutation.mutate({ email });
    setEmail("");
  };

  const handleLeave = () => {
    if (confirm("Are you sure you want to leave the team?")) {
      leaveMutation.mutate();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Team Members</h1>
        {!isOwner && (
          <button
            onClick={handleLeave}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            disabled={leaveMutation.isPending}
          >
            Leave Team
          </button>
        )}
      </div>

      {isOwner && (
        <form
          onSubmit={handleInvite}
          className="flex flex-col sm:flex-row gap-2 mb-8"
        >
          <input
            type="email"
            placeholder="Invite by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 p-2 border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-600"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            disabled={inviteMutation.isPending}
          >
            Invite
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {members.map((member) => {
          const isOwnerMember = member._id === ownerId;
          const isCurrentUser = member._id === user._id;

          return (
            <div
              key={member._id}
              className={`p-4 rounded-xl shadow-xl border ${
                isOwnerMember
                  ? "bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700"
                  : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700"
              }`}
            >
              <h2 className="text-xl font-bold capitalize flex gap-2 text-gray-900 dark:text-white items-center">
                {member.username}
                {isCurrentUser && (
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-300">(You)</span>
                )}
                {isOwnerMember && (
                  <span className="text-sm font-normal text-blue-700 dark:text-blue-300">(Owner)</span>
                )}
              </h2>
              <p className="text-gray-700 dark:text-gray-300">{member.email}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamPage;
