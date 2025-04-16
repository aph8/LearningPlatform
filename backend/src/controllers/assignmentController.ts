import { Request, Response, NextFunction } from "express";
import { AssignmentService } from "../services/assignmentService";
import {
  AssignmentRequest,
  AssignmentRequestSchema,
} from "../dtos/assignmentRequest";
import { AssignmentResponse } from "../dtos/assignmentResponse";
import { z } from "zod";
import { SubmissionService } from "../services/submissionService";

export class AssignmentController {
  constructor(
    private assignmentService: AssignmentService,
    private submissionService: SubmissionService,
  ) {}

  public createAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = AssignmentRequestSchema.parse(
        req.body,
      ) as AssignmentRequest;
      const jsonData = JSON.stringify(parsed.questionRequest);
      const assignment = await this.assignmentService.createAssignment({
        dueDate: new Date(parsed.dueDate),
        jsonData,
        courseId: parsed.courseId,
        assignmentName: parsed.assignmentName,
        published: parsed.published ?? false,
      });
      res.status(200).json({
        AssignmentId: assignment.assignmentId,
        message: "Assignment created",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res
          .status(400)
          .json({ message: "Validation failed", issues: err.errors });
        return;
      }
      next(err);
    }
  };

  public getAllAssignments = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const assignments = await this.assignmentService.getAllAssignments();
      res.status(200).json(assignments);
    } catch (err) {
      next(err);
    }
  };

  public getAssignmentById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { assignmentId } = req.params;
      const assignment = await this.assignmentService.getAssignmentById(
        Number(assignmentId),
      );

      const questionRequest = JSON.parse(assignment.jsonData);
      const response: AssignmentRequest = {
        dueDate: assignment.dueDate.toISOString().split("T")[0],
        questionRequest,
        courseId: assignment.courseId,
        assignmentName: assignment.assignmentName,
        published: assignment.published,
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  public getAssignmentsByCourse = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { courseId } = req.params;
      const assignments =
        await this.assignmentService.getAllAssignmentsByCourseId(
          Number(courseId),
        );
      const assignmentResponses: AssignmentResponse[] = assignments.map((a) => {
        let questionRequest = [];
        try {
          questionRequest = JSON.parse(a.jsonData);
        } catch {
          res.status(500).json({ message: "Couldn't serialize question data" });
        }
        return {
          assignmentId: a.assignmentId,
          dueDate: a.dueDate.toISOString().split("T")[0],
          questionRequest,
          courseId: a.courseId,
          assignmentName: a.assignmentName,
          published: a.published,
        };
      });
      res.status(200).json(assignmentResponses);
    } catch (err) {
      next(err);
    }
  };

  public editAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { assignmentId } = req.params;
      const updateData = req.body as Partial<AssignmentRequest>;
      const assignment = await this.assignmentService.getAssignmentById(
        Number(assignmentId),
      );

      if (updateData.dueDate) {
        assignment.dueDate = new Date(updateData.dueDate);
      }
      if (updateData.assignmentName) {
        assignment.assignmentName = updateData.assignmentName;
      }
      if (updateData.courseId !== undefined) {
        assignment.courseId = updateData.courseId;
      }
      if (updateData.questionRequest) {
        try {
          assignment.jsonData = JSON.stringify(updateData.questionRequest);
        } catch (e) {
          console.error("JSON serialization error:", e);
          res.status(500).json({ message: "Couldn't serialize question data" });
          return;
        }
      }
      if (updateData.published !== undefined) {
        if (!updateData.published) {
          const canUnpublish = await this.assignmentService.canBeUnpublished(
            Number(assignmentId),
          );
          if (!canUnpublish) {
            res.status(400).json({
              message:
                "Assignment cannot be unpublished because students are already working on it.",
            });
            return;
          }
        }
        assignment.published = updateData.published;
      }
      await this.assignmentService.updateAssignment(Number(assignmentId), {
        dueDate: assignment.dueDate,
        jsonData: assignment.jsonData,
        courseId: assignment.courseId,
        assignmentName: assignment.assignmentName,
        published: assignment.published,
      });
      res.status(200).json({ message: "Assignment updated" });
    } catch (err) {
      next(err);
    }
  };

  public deleteAssignment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const assignmentId = Number(req.params.assignmentId);

      const hasSubmissions =
        await this.submissionService.hasAnySubmissions(assignmentId);
      if (hasSubmissions) {
        res.status(400).json({
          message: "Cannot delete assignment. Students have already submitted.",
        });
        return;
      }

      await this.assignmentService.deleteAssignmentById(assignmentId);
      res.status(200).json({ message: "Assignment deleted successfully." });
    } catch (err) {
      next(err);
    }
  };

  public getCanUnpublish = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { assignmentId } = req.params;
      const canUnpublish = await this.assignmentService.canBeUnpublished(
        Number(assignmentId),
      );
      res.status(200).json({ canUnpublish });
    } catch (err) {
      next(err);
    }
  };

  public getCanDelete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const assignmentId = Number(req.params.assignmentId);
      const canDelete =
        await this.assignmentService.canDeleteAssignment(assignmentId);
      res.status(200).json({ canDelete });
    } catch (err) {
      next(err);
    }
  };
}
