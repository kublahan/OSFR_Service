import { RequestHandler } from 'express';

export interface Instruction {
  id: number;
  title: string;
  content: string;
  category_id: number;
  category_name?: string;
}

export type CreateInstructionBody = {
  title: string;
  content: string;
  category_id: number;
};

export type UpdateInstructionBody = CreateInstructionBody;

export type InstructionController = {
  getInstructions: RequestHandler;
  getInstructionById: RequestHandler<{ id: string }>;
  createInstruction: RequestHandler<{}, any, CreateInstructionBody>;
  updateInstruction: RequestHandler<{ id: string }, any, UpdateInstructionBody>;
  deleteInstruction: RequestHandler<{ id: string }>;
};