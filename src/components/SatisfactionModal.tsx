import React, { useState } from 'react';
import { saveSatisfactionSurvey, SatisfactionSurveyData } from '../firebase';
import { Star, CheckCircle, MessageSquare } from 'lucide-react';
import { AdaptiveOverlay } from './AdaptiveOverlay';

interface SatisfactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractId: string;
}

export const SatisfactionModal: React.FC<SatisfactionModalProps> = ({
  isOpen,
  onClose,
  contractId,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['부동산 방문 불필요', '5% 자동 계산']);
  const [comment, setComment] = useState<string>('집에서 카톡으로 3분 만에 전세 재계약이 끝나서 시간과 비용을 엄청 아꼈어요!');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const availableTags = [
    '중개수수료 0원',
    '부동산 방문 불필요',
    '5% 자동 계산',
    '등기부 모니터링 안심',
    '카톡 알림톡 서명 편리',
    '법적 효력 완비'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const surveyData: SatisfactionSurveyData = {
      rating,
      role: 'tenant',
      flowStep: 8,
      feedbackTags: selectedTags,
      comment,
      contractId,
      submittedAt: new Date().toISOString(),
    };

    await saveSatisfactionSurvey(surveyData);
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <AdaptiveOverlay
      isOpen={isOpen}
      onClose={onClose}
      presentationMode="auto"
      maxWidthClass="max-w-md"
      heightClass="h-auto"
      mobileHeightClass="max-h-[85vh]"
      icon={
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
          <Star className="w-4 h-4 fill-current" />
        </div>
      }
      title="집콕재계약 만족도 평가"
      subtitle="서비스 이용 소감 및 개선 피드백"
    >
      <div className="space-y-4 text-slate-100">
        {!submitted ? (
          <>
            <div className="space-y-1">
              <span className="text-[11px] text-blue-400 font-bold uppercase tracking-wider">
                User Satisfaction Feedback
              </span>
              <h3 className="text-base md:text-lg font-bold text-white">
                집콕재계약 서비스는 어떠셨나요?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                고객님의 소중한 평가는 더 안전한 주택임대차 문화를 만드는 데 쓰입니다.
              </p>
            </div>

            {/* 별점 선택 1~5 */}
            <div className="flex items-center justify-center gap-2 py-3 bg-slate-900 rounded-xl border border-slate-800">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-transform hover:scale-110 cursor-pointer ${
                    star <= rating ? 'text-amber-400' : 'text-slate-600'
                  }`}
                >
                  ★
                </button>
              ))}
              <span className="text-xs font-bold text-amber-400 ml-2">{rating}점 / 5점</span>
            </div>

            {/* 태그 선택 */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">가장 만족스러웠던 점 (다중 선택)</label>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 코멘트 입력 */}
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">한 줄 후기</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
                placeholder="솔직한 후기를 남겨주세요..."
              />
            </div>

            {/* 제출 버튼 */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md disabled:bg-slate-700 mt-2"
            >
              {loading ? 'Firestore에 저장 중...' : '만족도 평가 저장하기'}
            </button>
          </>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">평가가 성공적으로 제출되었습니다!</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Firestore(/satisfaction_surveys)에 안전하게 기록되었습니다.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              닫기
            </button>
          </div>
        )}
      </div>
    </AdaptiveOverlay>
  );
};
