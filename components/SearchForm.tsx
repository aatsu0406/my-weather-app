"use client";

import { Search } from 'lucide-react';

interface SearchFormProps {
  inputCity: string;  //親から情報を「もらう」
  setInputCity: (value: string) => void;  //親に情報を「届ける」
  onSearch: () => void; //親に合図を「送る」
}

export const SearchForm = ({ inputCity, setInputCity, onSearch }:   SearchFormProps) => { //親から送られてきた中身を直接取り出してる（分割代入）
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // フォームのデフォルトの送信動作をキャンセル
        onSearch(); // 親コンポーネントに検索の合図を送る
      }}
      className="flex gap-3 mb-10 w-full"
    >
      <div className="relative flex-1">
        <input 
          type="text"
          className="w-full p-2.5 pl-10 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none text-slate-700 text-sm"
          placeholder="都市名を入力（例: 大阪市）"
          value={inputCity} //親からもらった情報を表示する
          onChange={(e) => setInputCity(e.target.value)}  //入力された内容を親に届ける
        />
        <Search className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 text-sm shadow-md shadow-blue-200 cursor-pointer whitespace-nowrap"
      >
        検索
      </button>
    </form>
  );
};