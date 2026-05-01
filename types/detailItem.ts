export interface DetailItemProps {
  icon: React.ReactNode; // Reactのコンポーネント（アイコン）を受け取る型
  label: string;
  value: string | number;
  isCenter?: boolean;     // ? をつけると「あってもなくても良い」になる
}