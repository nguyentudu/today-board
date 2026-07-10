import type { BoardState } from "../domain/state";

export type Language = "vi" | "en";

export const copy = {
  en: {
    title: "Moon Today Board",
    subtitle: "Help me return without rebuilding my world.",
    createPlaceholder: "Name something to hold",
    createButton: "Create card",
    exportButton: "Export JSON",
    importButton: "Import board",
    selectedFile: "Selected:",
    savedNote: "Saved locally for continuity. No tracking.",
    changeZone: "Change zone",
    hideCard: "Hide card",
    cardName: "Card title",
    tinyNote: "Small note",
    contextSnapshot: "Snapshot: what is happening?",
    contextSnapshotEmpty: "No snapshot yet.",
    whyStillOpen: "Why is this still open?",
    whyStillOpenEmpty: "Not clear why this is still open.",
    ifYouReturn: "If I return, start here",
    ifYouReturnEmpty: "No starting point yet.",
    richLinks: "Link",
    richLinksEmpty: "Paste link here",
    imageRefs: "Images or screenshots",
    imageRefsEmpty: "Paste data:image or describe the image/screenshot here",
    bookmarkReason: "Why save?",
    bookmarkReasonEmpty: "Why do you want to keep this link/image?",
    savedContext: "Saved context",
    savedContextEmpty: "No saved link, image, or bookmark yet.",
    uploadImage: "Upload image",
    capturePhoto: "Capture photo",
    captureScreen: "Capture screen",
    screenCaptureUnsupported: "This browser does not support screen capture.",
    imageLocalNote: "Image is stored only in this browser or exported file.",
    recordVoice: "Record voice",
    stopRecording: "Stop recording",
    voiceUnsupported: "This browser does not support voice recording.",
    audioLocalNote: "Audio is stored only in this browser or exported file. No transcription.",
    attachFile: "Attach file",
    fileLocalNote: "Small files can be saved here. Large files may not persist well in browser storage.",
    fileTooLarge: "Large file saved as a reference only.",
    mediaCompressed: "Media size:",
    mediaTooLarge: "This media is too large for browser storage. It was not saved.",
    imageProcessing: "Processing image...",
    imageReady: "Image is ready to save.",
    imageProcessingFailed: "This image could not be processed.",
    imageTooLargeDevice: "This image is too large to store on this device.",
    storageNotEnough: "There is not enough browser storage for this media.",
    cardNotSaved: "The card was not saved.",
    storageAdvice: "Remove older media or export the board as a backup.",
    storageIndicator: "Board size",
    storageWarningThreshold: "Warning threshold",
    storagePercent: "Safe quota used",
    storageImages: "Images",
    storageAudio: "Audio",
    storageFiles: "Files",
    storageCards: "Cards",
    storageCleanup: "Clean hidden media",
    storageExportBeforeCleanup: "Export before cleanup",
    storageCleanupDone: "Hidden media cleaned.",
    storageCleanupEmpty: "No hidden media to clean.",
    storageHealthy: "Storage looks healthy.",
    storageMediaHeavy: "Images and audio use most of the space.",
    storageNearLimit: "Approaching the safe limit.",
    storageNeedsCleanup: "Clean up or export before adding more media.",
    storageViewDetails: "View storage details",
    storageCleanupConsequence: "This will remove media from hidden cards. It cannot be undone unless you exported the board first.",
    cancelAction: "Cancel",
    confirmAction: "Confirm",
    hiddenCardsAffected: "hidden cards affected",
    mediaItemsAffected: "media items",
    estimatedRecover: "estimated space to recover",
    removeMedia: "Remove",
    voiceLimit: "Voice recording stops after 20 seconds.",
    quickCaptureTitle: "Quick capture",
    quickCaptureButton: "Quick Capture",
    quickCaptureHelper: "Use this when you only want to save something quickly and leave.",
    quickCaptureLink: "Link",
    quickCaptureSave: "Save",
    quickCaptureSaved: "Saved.",
    quickCaptureEmpty: "Add a title, note, link, photo, or voice note before saving.",
    quickCaptureStorageError: "Could not save. The photo or voice note may be too large for browser storage.",
    quickCaptureBack: "Open board",
    created: "Created",
    lastTouched: "Last touched",
    currentState: "Current state",
    openCard: "Open",
    editCard: "Edit",
    collapseCard: "Collapse",
    imageLabel: "Image",
    voiceLabel: "voice note",
    linksLabel: "links",
    filesLabel: "files",
    noSnapshotSummary: "No snapshot yet.",
    retrievalTitle: "Find again",
    retrievalHelper: "Find something you saved.",
    searchCards: "Search cards...",
    resultCount: "results",
    noResults: "No matching cards found.",
    clearSearch: "Clear search",
    clearAllFilters: "Clear all filters",
    filtering: "Filtering:",
    stateFilter: "State",
    allStates: "All",
    clearFilter: "Clear",
    mediaFilters: "Media",
    hasImage: "Has image",
    hasVoice: "Has voice",
    hasFile: "Has file",
    hasLink: "Has link",
    lastTouchedFilter: "Last touched",
    anyTime: "Any time",
    todayFilter: "Today",
    last7: "Last 7 days",
    last30: "Last 30 days",
    older30: "Older than 30 days",
    tags: "Tags",
    tagsHelper: "Use lightweight tags to find this later.",
    tagsPlaceholder: "moon, research",
    testNotesTitle: "Test Notes",
    testNotes: ["Use this quietly.", "You can ignore everything here.", "No correct way to use this."],
    stateLabels: {
      continue: "Continue",
      pause: "Pause",
      finished: "Finished",
      "leave-alone": "Leave Alone",
    },
    stateCopy: {
      continue: "Available when you want to return.",
      pause: "Paused is valid.",
      finished: "Remove from active load.",
      "leave-alone": "Do not reopen unless chosen.",
    },
    emptyCopy: {
      continue: "Nothing needs to return right now.",
      pause: "Nothing is waiting here.",
      finished: "Nothing to release.",
      "leave-alone": "Nothing protected here.",
    },
  },
  vi: {
    title: "Moon Today Board",
    subtitle: "Giúp tôi quay lại mà không phải dựng lại mọi thứ.",
    createPlaceholder: "Viết một điều cần giữ lại",
    createButton: "Tạo card",
    exportButton: "Xuất JSON",
    importButton: "Nhập board",
    selectedFile: "Selected:",
    savedNote: "Đã lưu trên máy này. Không theo dõi.",
    changeZone: "Đổi vùng",
    hideCard: "Ẩn card",
    cardName: "Tên card",
    tinyNote: "Ghi chú nhỏ",
    contextSnapshot: "Snapshot: chuyện gì đang diễn ra?",
    contextSnapshotEmpty: "Chưa ghi snapshot.",
    whyStillOpen: "Vì sao còn mở?",
    whyStillOpenEmpty: "Chưa rõ vì sao còn mở.",
    ifYouReturn: "Nếu quay lại, bắt đầu từ đâu?",
    ifYouReturnEmpty: "Chưa có điểm bắt đầu.",
    richLinks: "Link",
    richLinksEmpty: "Dán link ở đây",
    imageRefs: "Ảnh hoặc screenshot",
    imageRefsEmpty: "Dán data:image hoặc mô tả ảnh/screenshot ở đây",
    bookmarkReason: "Vì sao lưu?",
    bookmarkReasonEmpty: "Vì sao bạn muốn giữ lại link/ảnh này?",
    savedContext: "Ngữ cảnh đã lưu",
    savedContextEmpty: "Chưa lưu link, ảnh hoặc bookmark.",
    uploadImage: "Tải ảnh lên",
    capturePhoto: "Chụp ảnh",
    captureScreen: "Chụp màn hình",
    screenCaptureUnsupported: "Trình duyệt này chưa hỗ trợ chụp màn hình.",
    imageLocalNote: "Ảnh chỉ lưu trên trình duyệt hoặc file export.",
    recordVoice: "Ghi âm",
    stopRecording: "Dừng ghi âm",
    voiceUnsupported: "Trình duyệt này chưa hỗ trợ ghi âm.",
    audioLocalNote: "Âm thanh chỉ lưu trên trình duyệt hoặc file export. Không chuyển thành chữ.",
    attachFile: "Đính kèm file",
    fileLocalNote: "File nhỏ có thể lưu ở đây. File lớn có thể không giữ tốt trong bộ nhớ trình duyệt.",
    fileTooLarge: "File lớn chỉ được lưu như một dòng tham chiếu.",
    mediaCompressed: "Dung lượng media:",
    mediaTooLarge: "Media này quá lớn cho bộ nhớ trình duyệt. Chưa lưu media.",
    imageProcessing: "Đang xử lý ảnh...",
    imageReady: "Ảnh đã sẵn sàng để lưu.",
    imageProcessingFailed: "Không thể xử lý ảnh này.",
    imageTooLargeDevice: "Ảnh quá lớn để lưu trên thiết bị này.",
    storageNotEnough: "Không đủ bộ nhớ trình duyệt để lưu media này.",
    cardNotSaved: "Card chưa được lưu.",
    storageAdvice: "Hãy xóa media cũ hoặc xuất board để sao lưu.",
    storageIndicator: "Dung lượng board",
    storageWarningThreshold: "Ngưỡng cảnh báo",
    storagePercent: "Đã dùng trong ngưỡng an toàn",
    storageImages: "Ảnh",
    storageAudio: "Âm thanh",
    storageFiles: "File",
    storageCards: "Card",
    storageCleanup: "Dọn media đã ẩn",
    storageExportBeforeCleanup: "Xuất trước khi dọn",
    storageCleanupDone: "Đã dọn media trong card ẩn.",
    storageCleanupEmpty: "Không có media ẩn để dọn.",
    storageHealthy: "Dung lượng còn ổn.",
    storageMediaHeavy: "Ảnh và âm thanh đang dùng phần lớn bộ nhớ.",
    storageNearLimit: "Sắp chạm ngưỡng an toàn.",
    storageNeedsCleanup: "Cần dọn hoặc xuất board trước khi lưu thêm media.",
    storageViewDetails: "Xem chi tiết dung lượng",
    storageCleanupConsequence: "Thao tác này sẽ xóa media khỏi các card đã ẩn. Không thể hoàn tác nếu bạn chưa xuất board.",
    cancelAction: "Hủy",
    confirmAction: "Xác nhận",
    hiddenCardsAffected: "card ẩn bị ảnh hưởng",
    mediaItemsAffected: "media",
    estimatedRecover: "ước tính dung lượng thu lại",
    removeMedia: "Xóa",
    voiceLimit: "Ghi âm tự dừng sau 20 giây.",
    quickCaptureTitle: "Ghi nhanh",
    quickCaptureButton: "Ghi nhanh",
    quickCaptureHelper: "Dùng khi bạn chỉ muốn giữ lại nhanh rồi rời đi.",
    quickCaptureLink: "Link",
    quickCaptureSave: "Lưu",
    quickCaptureSaved: "Đã lưu.",
    quickCaptureEmpty: "Thêm tên, ghi chú, link, ảnh hoặc ghi âm trước khi lưu.",
    quickCaptureStorageError: "Chưa lưu được. Ảnh hoặc ghi âm có thể quá lớn cho bộ nhớ trình duyệt.",
    quickCaptureBack: "Mở board",
    created: "Đã tạo",
    lastTouched: "Lần cuối chạm",
    currentState: "Vùng hiện tại",
    openCard: "Mở",
    editCard: "Chỉnh sửa",
    collapseCard: "Thu gọn",
    imageLabel: "Ảnh",
    voiceLabel: "ghi âm",
    linksLabel: "link",
    filesLabel: "file",
    noSnapshotSummary: "Chưa ghi snapshot.",
    retrievalTitle: "Tìm lại",
    retrievalHelper: "Tìm một điều bạn đã giữ lại.",
    searchCards: "Tìm trong card...",
    resultCount: "kết quả",
    noResults: "Không tìm thấy card phù hợp.",
    clearSearch: "Xóa tìm kiếm",
    clearAllFilters: "Xóa tất cả bộ lọc",
    filtering: "Đang lọc:",
    stateFilter: "Vùng",
    allStates: "Tất cả",
    clearFilter: "Xóa",
    mediaFilters: "Media",
    hasImage: "Có ảnh",
    hasVoice: "Có ghi âm",
    hasFile: "Có file",
    hasLink: "Có link",
    lastTouchedFilter: "Lần cuối chạm",
    anyTime: "Mọi thời điểm",
    todayFilter: "Hôm nay",
    last7: "7 ngày gần đây",
    last30: "30 ngày gần đây",
    older30: "Lâu hơn 30 ngày",
    tags: "Thẻ",
    tagsHelper: "Dùng thẻ nhẹ để tìm lại sau.",
    tagsPlaceholder: "moon, nghiên cứu",
    testNotesTitle: "Test Notes",
    testNotes: ["Dùng thật nhẹ.", "Bạn có thể bỏ qua mọi thứ ở đây.", "Không có cách dùng đúng."],
    stateLabels: {
      continue: "Quay lại",
      pause: "Tạm dừng",
      finished: "Đã xong",
      "leave-alone": "Để yên",
    },
    stateCopy: {
      continue: "Có sẵn khi bạn muốn quay lại.",
      pause: "Tạm dừng là hợp lệ.",
      finished: "Gỡ khỏi tải đang mở.",
      "leave-alone": "Không mở lại trừ khi bạn chọn.",
    },
    emptyCopy: {
      continue: "Không có gì cần quay lại lúc này.",
      pause: "Không có gì đang chờ ở đây.",
      finished: "Không có gì cần gỡ ra.",
      "leave-alone": "Không có gì đang được giữ yên.",
    },
  },
} satisfies Record<
  Language,
  {
    title: string;
    subtitle: string;
    createPlaceholder: string;
    createButton: string;
    exportButton: string;
    importButton: string;
    selectedFile: string;
    savedNote: string;
    changeZone: string;
    hideCard: string;
    cardName: string;
    tinyNote: string;
    contextSnapshot: string;
    contextSnapshotEmpty: string;
    whyStillOpen: string;
    whyStillOpenEmpty: string;
    ifYouReturn: string;
    ifYouReturnEmpty: string;
    richLinks: string;
    richLinksEmpty: string;
    imageRefs: string;
    imageRefsEmpty: string;
    bookmarkReason: string;
    bookmarkReasonEmpty: string;
    savedContext: string;
    savedContextEmpty: string;
    uploadImage: string;
    capturePhoto: string;
    captureScreen: string;
    screenCaptureUnsupported: string;
    imageLocalNote: string;
    recordVoice: string;
    stopRecording: string;
    voiceUnsupported: string;
    audioLocalNote: string;
    attachFile: string;
    fileLocalNote: string;
    fileTooLarge: string;
    mediaCompressed: string;
    mediaTooLarge: string;
    imageProcessing: string;
    imageReady: string;
    imageProcessingFailed: string;
    imageTooLargeDevice: string;
    storageNotEnough: string;
    cardNotSaved: string;
    storageAdvice: string;
    storageIndicator: string;
    storageWarningThreshold: string;
    storagePercent: string;
    storageImages: string;
    storageAudio: string;
    storageFiles: string;
    storageCards: string;
    storageCleanup: string;
    storageExportBeforeCleanup: string;
    storageCleanupDone: string;
    storageCleanupEmpty: string;
    storageHealthy: string;
    storageMediaHeavy: string;
    storageNearLimit: string;
    storageNeedsCleanup: string;
    storageViewDetails: string;
    storageCleanupConsequence: string;
    cancelAction: string;
    confirmAction: string;
    hiddenCardsAffected: string;
    mediaItemsAffected: string;
    estimatedRecover: string;
    removeMedia: string;
    voiceLimit: string;
    quickCaptureTitle: string;
    quickCaptureButton: string;
    quickCaptureHelper: string;
    quickCaptureLink: string;
    quickCaptureSave: string;
    quickCaptureSaved: string;
    quickCaptureEmpty: string;
    quickCaptureStorageError: string;
    quickCaptureBack: string;
    created: string;
    lastTouched: string;
    currentState: string;
    openCard: string;
    editCard: string;
    collapseCard: string;
    imageLabel: string;
    voiceLabel: string;
    linksLabel: string;
    filesLabel: string;
    noSnapshotSummary: string;
    retrievalTitle: string;
    retrievalHelper: string;
    searchCards: string;
    resultCount: string;
    noResults: string;
    clearSearch: string;
    clearAllFilters: string;
    filtering: string;
    stateFilter: string;
    allStates: string;
    clearFilter: string;
    mediaFilters: string;
    hasImage: string;
    hasVoice: string;
    hasFile: string;
    hasLink: string;
    lastTouchedFilter: string;
    anyTime: string;
    todayFilter: string;
    last7: string;
    last30: string;
    older30: string;
    tags: string;
    tagsHelper: string;
    tagsPlaceholder: string;
    testNotesTitle: string;
    testNotes: string[];
    stateLabels: Record<BoardState, string>;
    stateCopy: Record<BoardState, string>;
    emptyCopy: Record<BoardState, string>;
  }
>;
