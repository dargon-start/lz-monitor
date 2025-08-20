// 获取当前的时间戳
export function getTimestamp(): number {
  return Date.now();
}

/**
 * 精确获取变量的类型
 * @param target - 需要检测类型的目标变量
 * @returns 返回小写的类型字符串，如 'string', 'number', 'array', 'object' 等
 * @example
 * ```typescript
 * getExactType([]) // 'array'
 * getExactType({}) // 'object'
 * getExactType(null) // 'null'
 * getExactType(new Date()) // 'date'
 * ```
 */
export function typeofAny(target: unknown): string {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

// 检验参数类型
export function validateOption(target: any, targetName: string, expectType: string): boolean {
  // 更精确的空值检查
  if (target === null || target === undefined) {
    console.error(`lz-monitor: ${targetName} 不能为 null 或 undefined`);
    return false;
  }

  const actualType = typeofAny(target);
  if (actualType === expectType) {
    return true;
  }

  console.error(`lz-monitor: ${targetName} 期望传入 ${expectType} 类型，目前是 ${actualType} 类型`);
  return false;
}
