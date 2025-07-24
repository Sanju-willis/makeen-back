// src\types\agentRouter-types.ts
// src/types/agent-types.ts
export type AgentUser = {
  id: string;
  name?: string;
  platform: string;
};

export type AgentMeta = {
  user: AgentUser;
};
