import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorSolution } from '../entities/error-solution.entity';
import { GptAnalysisService } from './gpt-analysis.service';

@Injectable()
export class ErrorSolutionService {
  constructor(
    @InjectRepository(ErrorSolution)
    private readonly solutionRepository: Repository<ErrorSolution>,
    private readonly gptAnalysisService: GptAnalysisService,
  ) {}

  async getSolutionByErrorHash(
    errorHash: string,
  ): Promise<ErrorSolution | null> {
    return await this.solutionRepository.findOne({
      where: { errorHash, enabled: 1 },
    });
  }

  async analyzeWithGpt(
    errorHash: string,
    errorData: {
      errorType: string;
      message: string;
      stack?: string;
      fileName?: string;
      line?: number;
      column?: number;
      pageUrl?: string;
      breadcrumb?: any[];
    },
  ): Promise<ErrorSolution> {
    const existing = await this.getSolutionByErrorHash(errorHash);
    const existingSolution = existing?.solution;

    const gptResult = await this.gptAnalysisService.analyzeError(
      errorData,
      existingSolution,
    );

    if (existing) {
      existing.gptAnalysis = JSON.stringify(gptResult, null, 2);
      existing.solution = gptResult.solution;
      existing.isManual = 0;
      return await this.solutionRepository.save(existing);
    }

    const newSolution = this.solutionRepository.create({
      errorHash,
      solution: gptResult.solution,
      gptAnalysis: JSON.stringify(gptResult, null, 2),
      isManual: 0,
      enabled: 1,
    });
    return await this.solutionRepository.save(newSolution);
  }

  async saveManualSolution(
    errorHash: string,
    solution: string,
    updatedBy?: string,
  ): Promise<ErrorSolution> {
    const existing = await this.getSolutionByErrorHash(errorHash);
    if (existing) {
      existing.solution = solution;
      existing.isManual = 1;
      if (updatedBy) existing.updatedBy = updatedBy;
      return await this.solutionRepository.save(existing);
    }
    const payload: Partial<ErrorSolution> = {
      errorHash,
      solution,
      isManual: 1,
      enabled: 1,
    };
    if (updatedBy) {
      payload.createdBy = updatedBy;
      payload.updatedBy = updatedBy;
    }
    const newSolution = this.solutionRepository.create(payload);
    return await this.solutionRepository.save(newSolution);
  }
}
