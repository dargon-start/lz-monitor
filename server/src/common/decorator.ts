import { Transform } from 'class-transformer';
import { format } from 'date-fns';

// 封装格式化时间的装饰器
export function FormatDateColumn() {
  return Transform(({ value }: { value: Date }) => {
    // 由于date-fns默认认为value是utc时间
    // 但是数据库中我们存储的本地时间，因此减去8小时，转为utc时间
    const date = new Date(value);
    date.setHours(date.getHours() - 8);
    return format(date, 'yyyy-MM-dd HH:mm:ss');
  });
}
