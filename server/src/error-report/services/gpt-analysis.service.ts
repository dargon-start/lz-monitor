import { ChatOpenAI } from '@langchain/openai';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GptAnalysisService {
  private readonly logger = new Logger(GptAnalysisService.name);
  private readonly chatModel: ChatOpenAI;

  constructor() {
    const apiKey = 'sk-7c20c98f51a044ef89c62c6bc928e8d4';
    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY not found in environment variables');
    }

    this.chatModel = new ChatOpenAI({
      modelName: 'deepseek-chat',
      temperature: 0.3,
      openAIApiKey: apiKey,
    });
  }

  async analyzeError(
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
    existingSolution?: string,
  ): Promise<{
    analysis: string;
    solution: string;
    cause: string;
    severity: string;
  }> {
    const systemPrompt = `你是一名资深的前端开发工程师，擅长分析和解决JavaScript错误。\n要求：\n1. 分析要准确、专业\n2. 解决方案要具体、可操作\n3. 使用中文回答\n4. 如果提供了已存在的解决方案，请参考并优化`;

    const errorInfo = {
      错误类型: errorData.errorType,
      错误消息: errorData.message,
      错误位置: errorData.fileName
        ? `${errorData.fileName}:${errorData.line}:${errorData.column}`
        : '未知',
      堆栈信息: errorData.stack || '无',
      页面URL: errorData.pageUrl || '未知',
      用户行为: errorData.breadcrumb?.length ? '有' : '无',
    };

    let userPrompt = `请分析以下错误信息：\n\n${JSON.stringify(
      errorInfo,
      null,
      2,
    )}`;

    if (existingSolution) {
      userPrompt += `\n\n已存在的解决方案：\n${existingSolution}\n\n请基于以上信息，提供更完善的解决方案。`;
    }

    userPrompt += `\n\n请以JSON格式返回，包含以下字段：\n{\n  "cause": "错误原因分析",\n  "severity": "错误严重程度（low/medium/high/critical）",\n  "analysis": "详细分析（包含错误原因、影响范围等）",\n  "solution": "具体解决方案（步骤清晰、可操作）"\n}`;

    try {
      const response = await this.chatModel.invoke(
        `${systemPrompt}\n\n${userPrompt}`,
      );
      const content = (response as any)?.content || '';

      let result: any = null;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          result = JSON.parse(jsonMatch[0]);
        } catch (err) {
          this.logger.warn('Failed to parse GPT JSON, returning raw content');
        }
      }

      return {
        analysis: result?.analysis || content,
        solution: result?.solution || '暂无解决方案',
        cause: result?.cause || '未知原因',
        severity: result?.severity || 'medium',
      };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`GPT分析失败: ${err.message}`, err.stack);
      throw error;
    }
  }
}
