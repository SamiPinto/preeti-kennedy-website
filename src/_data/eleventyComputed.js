const WORDS = [
  "Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
  "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen",
  "Eighteen","Nineteen","Twenty","Twenty-one","Twenty-two","Twenty-three",
  "Twenty-four","Twenty-five","Twenty-six","Twenty-seven","Twenty-eight",
  "Twenty-nine","Thirty",
];

export default {
  /**
   * The homepage headline reads "Twenty essays worth stopping for." Spelling the
   * number out is an editorial choice, so this keeps the word form and falls back
   * to digits past thirty rather than inventing awkward compounds.
   */
  essayCount: (data) => {
    const n = data.collections?.essays?.length ?? 0;
    return WORDS[n] ?? String(n);
  },
};
