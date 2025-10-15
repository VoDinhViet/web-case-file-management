import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function BasicFieldsPreview() {
  return (
    <div className="space-y-3 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 p-4">
      <div className="flex items-center gap-2">
        <h4 className="font-semibold">Thông tin cơ bản</h4>
        <Badge variant="secondary" className="text-xs">
          Mặc định
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground">
        Cung cấp thông tin chung về vụ án
      </p>
      <div className="space-y-2">
        {/* Tên vụ án */}
        <div className="space-y-1">
          <label htmlFor="preview-name" className="text-sm font-medium">
            Tên vụ án <span className="text-red-500 ml-1">*</span>
          </label>
          <Input
            id="preview-name"
            placeholder="Nhập tên vụ án"
            disabled
            className="bg-background"
          />
          <p className="text-xs text-muted-foreground">Nhập tên vụ án</p>
        </div>

        {/* Điều & Cán bộ thụ lý */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label htmlFor="preview-law" className="text-sm font-medium">
              Điều
            </label>
            <Input
              id="preview-law"
              placeholder="Nhập điều"
              disabled
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="preview-user" className="text-sm font-medium">
              Cán bộ thụ lý
            </label>
            <Input
              id="preview-user"
              placeholder="Chọn người thụ lý"
              disabled
              className="bg-background"
            />
          </div>
        </div>

        {/* Số bị can & Loại tội phạm */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label htmlFor="preview-defendants" className="text-sm font-medium">
              Số bị can
            </label>
            <Input
              id="preview-defendants"
              type="number"
              placeholder="0"
              disabled
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="preview-crime" className="text-sm font-medium">
              Loại tội phạm
            </label>
            <Input
              id="preview-crime"
              placeholder="VD: GH Lần 2..."
              disabled
              className="bg-background"
            />
          </div>
        </div>

        {/* Ngày khởi tố & Ngày hết hạn */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label htmlFor="preview-start" className="text-sm font-medium">
              Ngày khởi tố
            </label>
            <Input
              id="preview-start"
              type="date"
              disabled
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="preview-end" className="text-sm font-medium">
              Ngày hết hạn
            </label>
            <Input
              id="preview-end"
              type="date"
              disabled
              className="bg-background"
            />
          </div>
        </div>

        {/* Mô tả vụ án */}
        <div className="space-y-1">
          <label htmlFor="preview-desc" className="text-sm font-medium">
            Mô tả vụ án
          </label>
          <Textarea
            id="preview-desc"
            placeholder="Nhập mô tả vụ án"
            disabled
            className="bg-background"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
