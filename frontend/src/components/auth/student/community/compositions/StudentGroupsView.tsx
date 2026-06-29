// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { Box, Stack, Inline, Divider } from "@/components/primitives";
// import { djangoService } from "@/services/djangoService";
// import { GroupListItem } from "../blocks";

// export function StudentGroupsView() {
//   const [groups, setGroups] = useState<any[]>([]);
//   const [selectedGroup, setSelectedGroup] = useState<any>(null);
//   const [members, setMembers] = useState<any[]>([]);
//   const [newUserId, setNewUserId] = useState("");

//   const loadGroups = useCallback(async () => {
//     const data = await djangoService.getGroups();
//     setGroups(data);
//   }, []);

//   useEffect(() => {
//     let cancelled = false;

//     async function load() {
//       const data = await djangoService.getGroups();
//       if (!cancelled) {
//         setGroups(data);
//       }
//     }

//     load();

//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   async function selectGroup(group: any) {
//     setSelectedGroup(group);
//     const m = await djangoService.getGroupMembers(group.id);
//     setMembers(m);
//   }

//   async function createGroup() {
//     const name = prompt("Group name?");
//     if (!name) return;

//     await djangoService.createGroup({ name });
//     loadGroups();
//   }

//   async function addMember() {
//     if (!selectedGroup || !newUserId) return;

//     await djangoService.addMemberToGroup(selectedGroup.id, Number(newUserId));

//     const updated = await djangoService.getGroupMembers(selectedGroup.id);
//     setMembers(updated);
//     setNewUserId("");
//   }

//   async function removeMember(userId: number) {
//     if (!selectedGroup) return;

//     await djangoService.removeMemberFromGroup(selectedGroup.id, userId);

//     setMembers((prev) => prev.filter((m) => m.user !== userId));
//   }

//   async function exitGroup() {
//     if (!selectedGroup) return;

//     await djangoService.exitGroup(selectedGroup.id);
//     setSelectedGroup(null);
//     loadGroups();
//   }

//   async function deleteGroup() {
//     if (!selectedGroup) return;

//     await djangoService.deleteGroup(selectedGroup.id);
//     setSelectedGroup(null);
//     loadGroups();
//   }

//   return (
//     <Inline grow>
//       {/* LEFT PANEL */}
//       <Box style={{ width: 260, borderRight: "1px solid #eee", padding: 16 }}>
//         <Stack gap={8}>
//           <h3>My Groups</h3>

//           <button onClick={createGroup}>+ Create Group</button>

//           {groups.map((g) => (
//             <GroupListItem
//               key={g.id}
//               group={g}
//               active={selectedGroup?.id === g.id}
//               onClick={() => selectGroup(g)}
//             />
//           ))}
//         </Stack>
//       </Box>

//       {/* RIGHT PANEL */}
//       <Box grow style={{ padding: 16 }}>
//         {!selectedGroup && <div>Select a group</div>}

//         {selectedGroup && (
//           <Stack gap={16}>
//             <h2>{selectedGroup.name}</h2>
//             <Divider />

//             <h4>Members</h4>

//             {members.map((m) => (
//               <Inline key={m.id} justify="between">
//                 <span>
//                   {m.username} ({m.role})
//                 </span>
//                 <button onClick={() => removeMember(m.user)}>Remove</button>
//               </Inline>
//             ))}

//             <Divider />

//             <Inline>
//               <input
//                 placeholder="User ID to add"
//                 value={newUserId}
//                 onChange={(e) => setNewUserId(e.target.value)}
//               />
//               <button onClick={addMember}>Add</button>
//             </Inline>

//             <Divider />

//             <Inline gap={12}>
//               <button
//                 onClick={() =>
//                   (window.location.href = `/student/community/chat?group=${selectedGroup.id}`)
//                 }
//               >
//                 Open Chat
//               </button>

//               <button onClick={exitGroup}>Exit</button>
//               <button onClick={deleteGroup}>Delete</button>
//             </Inline>
//           </Stack>
//         )}
//       </Box>
//     </Inline>
//   );
// }

"use client";

import { useCallback, useEffect, useState } from "react";
import { Box, Stack, Inline, Spacer } from "@/components/shared/primitives";
import { djangoService } from "@/services/djangoService";
import { GroupListItem } from "../blocks";

export function StudentGroupsView() {
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [newUserId, setNewUserId] = useState("");

  const loadGroups = useCallback(async () => {
    const data = await djangoService.getGroups();
    setGroups(data);
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  async function selectGroup(group: any) {
    setSelectedGroup(group);
    const m = await djangoService.getGroupMembers(group.id);
    setMembers(m);
  }

  return (
    <Inline
      grow
      className="h-screen bg-neutral-50 text-neutral-900 overflow-hidden"
    >
      {/* SIDEBAR */}
      <Box className="w-[320px] bg-white border-r border-neutral-200 flex flex-col">
        {/* Header */}
        <Box className="px-6 pt-6 pb-4">
          <Inline justify="between" align="center" className="mb-4">
            <h3 className="text-lg font-semibold tracking-tight">
              Communities
            </h3>

            <button
              onClick={async () => {
                const name = prompt("Group name?");
                if (name) {
                  await djangoService.createGroup({ name });
                  loadGroups();
                }
              }}
              className="text-sm font-medium bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Create
            </button>
          </Inline>

          <input
            placeholder="Search groups..."
            className="w-full bg-neutral-100 border border-transparent rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:bg-white transition"
          />
        </Box>

        {/* Group List */}
        <Stack gap={4} className="px-3 overflow-y-auto pb-6">
          {groups.map((g) => (
            <div
              key={g.id}
              className={`rounded-lg transition-colors ${
                selectedGroup?.id === g.id
                  ? "bg-neutral-900 text-white"
                  : "hover:bg-neutral-100 text-neutral-700"
              }`}
            >
              <GroupListItem
                group={g}
                active={selectedGroup?.id === g.id}
                onClick={() => selectGroup(g)}
              />
            </div>
          ))}
        </Stack>
      </Box>

      {/* DETAIL VIEW */}
      <Box grow className="h-full overflow-y-auto bg-neutral-50">
        {!selectedGroup ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400">
            <div className="text-6xl mb-4">🏔️</div>
            <p className="text-sm font-medium">Select a workspace to begin</p>
          </div>
        ) : (
          <Box className="max-w-5xl mx-auto py-10 px-8">
            {/* GROUP HERO */}
            <Box className="bg-white rounded-xl p-8 border border-neutral-200">
              <Inline justify="between" align="start">
                <Stack gap={4}>
                  <div className="w-14 h-14 bg-neutral-900 rounded-lg flex items-center justify-center text-white text-lg font-semibold">
                    {selectedGroup.name.charAt(0)}
                  </div>

                  <h2 className="text-2xl font-semibold tracking-tight">
                    {selectedGroup.name}
                  </h2>

                  <p className="text-sm text-neutral-500">
                    Created by @system • {members.length} active members
                  </p>
                </Stack>

                <button
                  onClick={() =>
                    (window.location.href = `/student/community/chat?group=${selectedGroup.id}`)
                  }
                  className="bg-neutral-900 hover:bg-neutral-800 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
                >
                  Open Chat
                </button>
              </Inline>
            </Box>

            <Spacer size={40} />

            {/* MEMBERS */}
            <Stack gap={24}>
              <Box>
                <Inline justify="between" align="center" className="mb-6">
                  <h4 className="text-sm font-semibold tracking-tight">
                    Active Members
                  </h4>
                  <div className="h-px grow ml-6 bg-neutral-200" />
                </Inline>

                <div className="grid grid-cols-2 gap-4">
                  {members.map((m) => (
                    <Box
                      key={m.id}
                      className="bg-white p-4 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition group"
                    >
                      <Inline justify="between" align="center">
                        <Inline gap={12} align="center">
                          <div className="w-9 h-9 rounded-md bg-neutral-200 text-neutral-700 flex items-center justify-center text-xs font-medium uppercase">
                            {m.username.slice(0, 2)}
                          </div>

                          <Stack gap={0}>
                            <span className="text-sm font-medium">
                              {m.username}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                              {m.role}
                            </span>
                          </Stack>
                        </Inline>

                        <button
                          onClick={() =>
                            djangoService
                              .removeMemberFromGroup(selectedGroup.id, m.user)
                              .then(() => selectGroup(selectedGroup))
                          }
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium text-neutral-400 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </Inline>
                    </Box>
                  ))}
                </div>
              </Box>

              {/* INVITE SECTION */}
              <Box className="bg-white rounded-lg border border-neutral-200 p-6">
                <Stack gap={16} align="center">
                  <p className="text-sm text-neutral-500 font-medium">
                    Invite more members
                  </p>

                  <Inline gap={8} className="w-full max-w-md">
                    <input
                      placeholder="Enter Student ID..."
                      className="grow bg-neutral-100 border border-transparent rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:bg-white transition"
                      value={newUserId}
                      onChange={(e) => setNewUserId(e.target.value)}
                    />

                    <button
                      onClick={async () => {
                        // DON'T use Number() if you want to support usernames
                        await djangoService.addMemberToGroup(
                          selectedGroup.id,
                          newUserId,
                        );
                        selectGroup(selectedGroup);
                        setNewUserId("");
                      }}
                      className="bg-neutral-900 text-white px-5 py-2 rounded-lg text-sm font-medium"
                    >
                      Add
                    </button>
                  </Inline>
                </Stack>
              </Box>

              {/* DANGER ZONE */}
              <Inline gap={24} justify="center" className="mt-8">
                <button
                  onClick={() =>
                    djangoService.exitGroup(selectedGroup.id).then(() => {
                      setSelectedGroup(null);
                      loadGroups();
                    })
                  }
                  className="text-xs font-medium text-neutral-500 hover:text-red-600 transition-colors"
                >
                  Exit Space
                </button>

                <button
                  onClick={() =>
                    djangoService.deleteGroup(selectedGroup.id).then(() => {
                      setSelectedGroup(null);
                      loadGroups();
                    })
                  }
                  className="text-xs font-medium text-neutral-500 hover:text-red-600 transition-colors"
                >
                  Delete Group
                </button>
              </Inline>
            </Stack>
          </Box>
        )}
      </Box>
    </Inline>
  );
}
