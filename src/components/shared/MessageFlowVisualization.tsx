import { useScenario } from '@/hooks/useScenario';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Bot, User, MessageCircle } from 'lucide-react';

interface MessageFlowNode {
  id: string;
  type: 'agent' | 'customer' | 'server';
  name: string;
  position: { x: number; y: number };
}

interface MessageFlowEdge {
  id: string;
  from: string;
  to: string;
  content: string;
  stepIndex: number;
}

export function MessageFlowVisualization() {
  const { state, active } = useScenario();

  // 현재 시나리오의 모든 참여자를 노드로 변환
  const nodes: MessageFlowNode[] = [
    {
      id: 'customer',
      type: 'customer',
      name: 'Customer',
      position: { x: 50, y: 200 },
    },
    ...(active.agent
      ? [
          {
            id: active.agent.name,
            type: 'agent' as const,
            name: active.agent.name,
            position: { x: 250, y: 100 },
          },
        ]
      : []),
    ...(active.server
      ? [
          {
            id: active.server.name,
            type: (active.server.type === 'ai' ? 'agent' : 'server') as
              | 'agent'
              | 'server',
            name: active.server.name,
            position: { x: 250, y: 300 },
          },
        ]
      : []),
  ];

  // 메시지 스텝들을 엣지로 변환
  const edges: MessageFlowEdge[] = state.steps
    .filter((step) => step.type === 'send-message')
    .map((step, index) => ({
      id: `edge-${index}`,
      from: step.action.from,
      to: step.action.to,
      content: step.action.content,
      stepIndex: index,
    }));

  return (
    <div className="relative w-full h-96 bg-card/20 rounded-lg border border-border overflow-hidden">
      {/* 노드들 렌더링 */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'absolute w-16 h-16 rounded-full flex items-center justify-center border-2',
            node.type === 'customer' && 'bg-blue-500/20 border-blue-500',
            node.type === 'agent' && 'bg-green-500/20 border-green-500',
            node.type === 'server' && 'bg-purple-500/20 border-purple-500'
          )}
          style={{
            left: `${node.position.x}px`,
            top: `${node.position.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {node.type === 'customer' && (
            <User className="w-6 h-6 text-blue-500" />
          )}
          {node.type === 'agent' && <Bot className="w-6 h-6 text-green-500" />}
          {node.type === 'server' && (
            <MessageCircle className="w-6 h-6 text-purple-500" />
          )}
        </motion.div>
      ))}

      {/* 엣지들 렌더링 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {edges.map((edge) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);

          if (!fromNode || !toNode) return null;

          const x1 = fromNode.position.x;
          const y1 = fromNode.position.y;
          const x2 = toNode.position.x;
          const y2 = toNode.position.y;

          // 화살표 중간점 계산
          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;

          return (
            <g key={edge.id}>
              {/* 메시지 선 */}
              <motion.line
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: edge.stepIndex * 0.5, duration: 0.8 }}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary/60"
                markerEnd="url(#arrowhead)"
              />

              {/* 메시지 내용 표시 */}
              <motion.foreignObject
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: edge.stepIndex * 0.5 + 0.4 }}
                x={midX - 100}
                y={midY - 20}
                width="200"
                height="40"
              >
                <div className="bg-background/90 backdrop-blur-sm rounded px-2 py-1 border text-xs text-center shadow-lg">
                  {edge.content.length > 30
                    ? `${edge.content.substring(0, 30)}...`
                    : edge.content}
                </div>
              </motion.foreignObject>
            </g>
          );
        })}

        {/* 화살표 마커 정의 */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="currentColor"
              className="text-primary/60"
            />
          </marker>
        </defs>
      </svg>

      {/* 범례 */}
      <div className="absolute bottom-4 left-4 flex space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <User className="w-4 h-4 text-blue-500" />
          <span>Customer</span>
        </div>
        <div className="flex items-center space-x-1">
          <Bot className="w-4 h-4 text-green-500" />
          <span>AI Agent</span>
        </div>
        <div className="flex items-center space-x-1">
          <MessageCircle className="w-4 h-4 text-purple-500" />
          <span>Server</span>
        </div>
      </div>
    </div>
  );
}
