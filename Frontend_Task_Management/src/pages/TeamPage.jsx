import React, { useState } from "react";
import {
  useMyTeam,
  useLeaveTeam,
  useInviteToTeam,
  useCreateTeam,
} from "../hooks/useTeam";
import { useAuth } from "../contexts/AuthContext";
import { 
  Users, 
  Mail, 
  Crown, 
  LogOut, 
  Plus, 
  Loader2, 
  AlertCircle,
  UserPlus,
  Users2,
  Shield
} from "lucide-react";

const TeamPage = () => {
  const { user } = useAuth();
  const {
    data: team,
    isLoading,
    error,
  } = useMyTeam({
    enabled: !!user,
  });

  const [email, setEmail] = useState("");

  const inviteMutation = useInviteToTeam();
  const leaveMutation = useLeaveTeam();
  const createTeamMutation = useCreateTeam();

  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    createTeamMutation.mutate(
      { name: email.trim() },
      {
        onSuccess: () => {
          setEmail("");
        },
      }
    );
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    inviteMutation.mutate({ email: email.trim() });
    setEmail("");
  };

  const handleLeave = () => {
    if (confirm("Are you sure you want to leave the team?")) {
      leaveMutation.mutate();
    }
  };

  // Loading state with spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading team information...</p>
        </div>
      </div>
    );
  }

  const showCreateForm =
    !user?.team || user.team === "" || error?.message === "Team not found";

  // Create team form
  if (showCreateForm) {
    return (
      <div className=" flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Create Your Team
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Start collaborating with your colleagues
              </p>
            </div>

            {/* Create team form */}
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your team name"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={createTeamMutation.isPending}
              >
                {createTeamMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Team...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Team
                  </>
                )}
              </button>
            </form>

            {/* Info message */}
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  You're not part of any team yet. Create one to get started!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg">Error: {error?.message}</p>
        </div>
      
    );
  }

  const members = team?.team?.members || [];
  const ownerId = team.team.owner._id;
  const isOwner = user._id === ownerId;

  return (
    
      <div className="max-w-6xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Users2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {team?.team?.name || "Team"}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 flex items-center gap-2 mt-1">
                  <Users className="w-4 h-4" />
                  {members.length} member{members.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {!isOwner && (
              <button
                onClick={handleLeave}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={leaveMutation.isPending}
              >
                {leaveMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Leaving...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    Leave Team
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Invite Section */}
        {isOwner && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Invite Team Members
              </h2>
            </div>
            
            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter email address to invite"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={inviteMutation.isPending}
              >
                {inviteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Inviting...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Send Invite
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Members Section */}
        <div className="bg-white dark:bg-gray-700 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-20">
          <div className="flex items-center gap-3 mb-6 ">
            <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Team Members
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {members.map((member) => {
              const isOwnerMember = member._id === ownerId;
              const isCurrentUser = member._id === user._id;

              return (
                <div
                  key={member._id}
                  className={`group relative p-6 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${
                    isOwnerMember
                      ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800"
                      : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-900"
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-3 ">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white ${
                      isOwnerMember 
                        ? "bg-gradient-to-r from-blue-600 to-purple-600" 
                        : "bg-gradient-to-r from-gray-600 to-gray-700"
                    }`}>
                      {member.username?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize truncate">
                          {member.username}
                        </h3>
                        
                        {isOwnerMember && (
                          <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                            <Crown className="w-3 h-3" />
                            Owner
                          </div>
                        )}
                        
                        {isCurrentUser && (
                          <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-medium">
                            <Shield className="w-3 h-3" />
                            You
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                        {member.email}
                      </p>
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              );
            })}
          </div>

          {members.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No team members yet</p>
            </div>
          )}
        </div>
      </div>
    
  );
};

export default TeamPage;