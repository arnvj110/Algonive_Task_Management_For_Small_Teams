import React from "react";
import { useJoinTeam, useMyInvites, useRejectInvites } from "../hooks/useTeam";

const Invites = () => {
  const { data, isLoading, error } = useMyInvites();
  const invites = data?.invites ?? [];

  const acceptMutation = useJoinTeam();
  const rejectMutation = useRejectInvites();

  if (isLoading) return <p>Loading invites...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Pending Invites
      </h1>

      {invites.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">You have no pending invites.</p>
      ) : (
        <div className="space-y-4">
          {invites.map((invite) => (
            <div
              key={invite.teamId}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white capitalize">
                {invite.teamName}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Invited by: <strong>{invite.invitedBy.username}</strong>
              </p>

              <div className="flex gap-4">
                <button
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
                  onClick={() => acceptMutation.mutate({ teamId: invite.teamId })}
                  disabled={acceptMutation.isPending}
                >
                  Accept
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                  onClick={() => rejectMutation.mutate({ teamId: invite.teamId })}
                  disabled={rejectMutation.isPending}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invites;
