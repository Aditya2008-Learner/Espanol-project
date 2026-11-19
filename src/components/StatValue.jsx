import { useCountUp } from '../motion/useCountUp';

export function StatValue({ value, suffix = '', className = '' }) {
  const ref = useCountUp(value, { suffix });
  return <span ref={ref} className={className}>0{suffix}</span>;
}
