import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useScenarioStore } from "@/stores/scenarioStore";
import {
  Edit,
  Save,
  FileJson,
  Eye,
  Download,
  Upload,
  AlertTriangle,
  Check,
  Code,
} from "lucide-react";
import type { Scenario } from "@/types";

export function ScenarioEditor() {
  const { currentScenario, loadScenario } = useScenarioStore();
  const [isOpen, setIsOpen] = useState(false);
  const [jsonContent, setJsonContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(false);

  const handleOpen = () => {
    if (currentScenario) {
      setJsonContent(JSON.stringify(currentScenario, null, 2));
      setValidationError(null);
      setIsValid(true);
    } else {
      setJsonContent(JSON.stringify(getEmptyScenario(), null, 2));
    }
    setIsOpen(true);
    setIsEditing(false);
  };

  const getEmptyScenario = (): Scenario => ({
    id: `scenario-${Date.now()}`,
    title: "New Scenario",
    phase: "A2H",
    steps: [
      {
        id: "step-1",
        type: "message",
        actor: "user",
        section: "left",
        content: "Hello, I need help with...",
        timing: { delay: 1, duration: 2 },
        animation: { type: "typing", easing: "linear" },
      },
    ],
  });

  const validateScenario = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);

      // Basic validation
      if (
        !parsed.id ||
        !parsed.title ||
        !parsed.phase ||
        !Array.isArray(parsed.steps)
      ) {
        setValidationError(
          "Missing required fields: id, title, phase, or steps",
        );
        return false;
      }

      // Validate phase
      if (!["A2H", "LiteAgent", "A2A"].includes(parsed.phase)) {
        setValidationError("Phase must be one of: A2H, LiteAgent, A2A");
        return false;
      }

      // Validate steps
      for (let i = 0; i < parsed.steps.length; i++) {
        const step = parsed.steps[i];
        if (
          !step.id ||
          !step.type ||
          !step.actor ||
          !step.section ||
          !step.content
        ) {
          setValidationError(`Step ${i + 1}: Missing required fields`);
          return false;
        }

        if (!["message", "call", "sms", "system_action"].includes(step.type)) {
          setValidationError(`Step ${i + 1}: Invalid type`);
          return false;
        }

        if (!["user", "ai_agent", "service_provider"].includes(step.actor)) {
          setValidationError(`Step ${i + 1}: Invalid actor`);
          return false;
        }

        if (!["left", "center", "right"].includes(step.section)) {
          setValidationError(`Step ${i + 1}: Invalid section`);
          return false;
        }

        if (
          !step.timing ||
          typeof step.timing.delay !== "number" ||
          typeof step.timing.duration !== "number"
        ) {
          setValidationError(`Step ${i + 1}: Invalid timing configuration`);
          return false;
        }
      }

      setValidationError(null);
      return true;
    } catch (error) {
      setValidationError("Invalid JSON syntax");
      return false;
    }
  };

  const handleJsonChange = (value: string) => {
    setJsonContent(value);
    const valid = validateScenario(value);
    setIsValid(valid);
  };

  const handleSave = () => {
    if (isValid) {
      try {
        const scenario = JSON.parse(jsonContent) as Scenario;
        loadScenario(scenario);
        setIsEditing(false);
        setIsOpen(false);
      } catch (error) {
        setValidationError("Failed to save scenario");
      }
    }
  };

  const handleExport = () => {
    if (currentScenario) {
      const blob = new Blob([JSON.stringify(currentScenario, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${currentScenario.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          if (validateScenario(content)) {
            setJsonContent(content);
            setIsEditing(true);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonContent(formatted);
    } catch (error) {
      // JSON is invalid, don't format
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            onClick={handleOpen}
            className="h-8 px-3 space-x-1.5"
          >
            <Edit className="w-3 h-3" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileJson className="w-5 h-5 text-primary" />
                <span>Scenario Editor</span>
                {currentScenario && (
                  <span className="text-sm text-muted-foreground">
                    ({currentScenario.title})
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" onClick={formatJson}>
                  <Code className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleImport}>
                  <Upload className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleExport}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 flex flex-col space-y-4">
            {/* Editor controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? (
                    <>
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </>
                  )}
                </Button>

                {/* Validation status */}
                <div className="flex items-center space-x-2">
                  {isValid ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Valid</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">Invalid</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!isValid}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-1" />
                  Save & Load
                </Button>
              </div>
            </div>

            {/* Error display */}
            <AnimatePresence>
              {validationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-md"
                >
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        Validation Error
                      </p>
                      <p className="text-sm text-red-600">{validationError}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* JSON Editor */}
            <Card className="flex-1 p-4 min-h-[400px]">
              {isEditing ? (
                <textarea
                  value={jsonContent}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  className={cn(
                    "w-full h-full resize-none bg-transparent border-none outline-none",
                    "font-mono text-sm",
                    "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
                  )}
                  placeholder="Enter scenario JSON..."
                  spellCheck={false}
                />
              ) : (
                <pre
                  className={cn(
                    "w-full h-full overflow-auto",
                    "font-mono text-sm text-muted-foreground",
                    "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
                  )}
                >
                  <code>{jsonContent}</code>
                </pre>
              )}
            </Card>

            {/* Schema reference */}
            <Card className="p-4 bg-muted/30">
              <h4 className="font-medium text-sm mb-2">Schema Reference:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <p>
                    <strong>phases:</strong> "A2H" | "LiteAgent" | "A2A"
                  </p>
                  <p>
                    <strong>step.type:</strong> "message" | "call" | "sms" |
                    "system_action"
                  </p>
                  <p>
                    <strong>step.actor:</strong> "user" | "ai_agent" |
                    "service_provider"
                  </p>
                </div>
                <div>
                  <p>
                    <strong>step.section:</strong> "left" | "center" | "right"
                  </p>
                  <p>
                    <strong>animation.type:</strong> "typing" | "appear" |
                    "call_ring" | "thinking"
                  </p>
                  <p>
                    <strong>timing:</strong>{" "}
                    {"{ delay: number, duration: number }"}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick actions */}
      <Button
        size="sm"
        variant="ghost"
        onClick={handleExport}
        disabled={!currentScenario}
        className="h-8 w-8 p-0"
      >
        <Download className="w-3 h-3" />
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={handleImport}
        className="h-8 w-8 p-0"
      >
        <Upload className="w-3 h-3" />
      </Button>
    </div>
  );
}
