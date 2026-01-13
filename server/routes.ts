import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const execAsync = promisify(exec);
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === Snippets API ===
  
  app.get(api.snippets.list.path, async (req, res) => {
    const snippets = await storage.getSnippets();
    res.json(snippets);
  });

  app.get(api.snippets.get.path, async (req, res) => {
    const snippet = await storage.getSnippet(Number(req.params.id));
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    res.json(snippet);
  });

  app.post(api.snippets.create.path, async (req, res) => {
    try {
      const input = api.snippets.create.input.parse(req.body);
      const snippet = await storage.createSnippet(input);
      res.status(201).json(snippet);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.snippets.delete.path, async (req, res) => {
    const success = await storage.deleteSnippet(Number(req.params.id));
    res.status(204).send();
  });

  // === Run Python API ===

  app.post(api.run.execute.path, async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ message: "Code is required" });
      }

      // Create a temporary file to run the python code
      const tempFile = path.join("/tmp", `script_${Date.now()}.py`);
      await writeFileAsync(tempFile, code);

      try {
        // Execute python script with a timeout
        const { stdout, stderr } = await execAsync(`python3 ${tempFile}`, { 
          timeout: 5000, // 5 second timeout
          maxBuffer: 1024 * 1024, // 1MB output limit
        });

        res.json({
          output: stdout || stderr, 
          error: stderr ? undefined : undefined // Treat stderr as output if script ran but printed to stderr
        });

      } catch (execError: any) {
        // Handle execution errors (syntax errors, timeout, etc)
        const errorMessage = execError.stderr || execError.message;
        res.json({
          output: "",
          error: errorMessage
        });
      } finally {
        // Cleanup temp file
        try {
          await unlinkAsync(tempFile);
        } catch (e) {
          console.error("Failed to delete temp file", e);
        }
      }

    } catch (error) {
      console.error("Server error running python code:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Seed data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existing = await storage.getSnippets();
  if (existing.length === 0) {
    await storage.createSnippet({
      title: "Hello World",
      description: "Basic print statement",
      code: `print("Hello, World!")`
    });
    
    await storage.createSnippet({
      title: "FizzBuzz",
      description: "Classic interview question",
      code: `for i in range(1, 16):
    if i % 3 == 0 and i % 5 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)`
    });

    await storage.createSnippet({
      title: "Fibonacci",
      description: "Calculate Fibonacci sequence",
      code: `def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)

for i in range(10):
    print(f"fib({i}) = {fib(i)}")`
    });
  }
}
