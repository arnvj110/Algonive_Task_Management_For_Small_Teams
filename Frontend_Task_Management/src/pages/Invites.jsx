import React from "react";
import { useJoinTeam, useMyInvites, useRejectInvites } from "../hooks/useTeam";
import { 
  Mail, 
  Users2, 
  Check, 
  X, 
  Loader2, 
  AlertCircle,
  Inbox,
  UserCheck,
  Clock
} from "lucide-react";

const Invites = () => {
  const { data, isLoading, error } = useMyInvites();
  
  const invites = data?.invites ?? [];
  const acceptMutation = useJoinTeam();
  const rejectMutation = useRejectInvites();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading your invitations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <p className="text-red-500 dark:text-red-400 text-lg">Error: {error?.message}</p>
        </div>
      </div>
    );
  }

  return (
    
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Team Invitations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {invites.length > 0 
              ? `You have ${invites.length} pending invitation${invites.length !== 1 ? 's' : ''}`
              : "Stay tuned for team collaboration opportunities"
            }
          </p>
        </div>

        {invites.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-700/50 rounded-2xl p-12 border border-gray-200 dark:border-gray-600/50 backdrop-blur-sm shadow-sm dark:shadow-none">
              <Inbox className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-300 mb-3">
                No Pending Invites
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                You don't have any team invitations at the moment. When someone invites you to join their team, you'll see it here.
              </p>
            </div>
          </div>
        ) : (
          /* Invites List */
          <div className="space-y-6">
            {invites.map((invite, index) => (
              <div
                key={invite.teamId}
                className="group bg-white dark:bg-gray-700/50 backdrop-blur-sm border border-gray-200 dark:border-gray-600/50 rounded-2xl p-6 hover:bg-gray-50 dark:hover:bg-gray-700/80 hover:border-gray-300 dark:hover:border-gray-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/10 hover:-translate-y-1 shadow-sm dark:shadow-none"
                
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Left Side - Invite Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Team Avatar */}
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Users2 className="w-7 h-7 text-white" />
                    </div>

                    {/* Invite Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white capitalize truncate">
                          {invite.teamName}
                        </h2>
                        <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full text-xs font-medium">
                          <Clock className="w-3 h-3" />
                          Pending
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-3">
                        <UserCheck className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm">
                          Invited by <strong className="text-gray-900 dark:text-white">{invite.name}</strong>
                        </span>
                      </div>

                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Join this team to start collaborating on projects and tasks together.
                      </p>
                    </div>
                  </div>

                  {/* Right Side - Action Buttons */}
                  <div className="flex gap-3 flex-shrink-0">
                    <button
                      className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-green-500/25"
                      onClick={() => acceptMutation.mutate({ teamId: invite.teamId })}
                      disabled={acceptMutation.isPending || rejectMutation.isPending}
                    >
                      {acceptMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Accept
                        </>
                      )}
                    </button>
                    
                    <button
                      className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-red-500/25"
                      onClick={() => rejectMutation.mutate({ teamId: invite.teamId })}
                      disabled={acceptMutation.isPending || rejectMutation.isPending}
                    >
                      {rejectMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          Decline
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 dark:from-blue-500/10 to-purple-600/5 dark:to-purple-600/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        {invites.length > 0 && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600/50 rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 shadow-sm dark:shadow-none">
              <AlertCircle className="w-4 h-4" />
              Accepting an invitation will add you to the team immediately
            </div>
          </div>
        )}
        
      </div>

      
    
  );
};

export default Invites;