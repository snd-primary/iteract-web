import { Container } from "@/components/layout/Container";
import { 
  Timer, 
  Controls, 
  CompletedCounter,
  ThemeToggle 
} from "@/components/pomodoro";
import { Settings } from "@/components/pomodoro/Settings";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <ThemeToggle />
      <Settings />
      
      <Container>
        <h1 className="text-3xl font-bold mb-8">Pomodoro Timer</h1>
        
        <div className="w-full bg-card rounded-xl shadow-sm border border-border p-8">
          <Timer />
          <Controls />
        </div>
        
        <CompletedCounter />
      </Container>
    </main>
  );
}
