unit XPGDI;

interface

uses
  Windows, Classes, ActiveX, ExtCtrls, Graphics, SysUtils, SynGdiPlus;

type
  TXPGDI = class(TGDIPlusFull)
  public
    DrawLine: function(graphics, pen, x1,y1,x2,y2: integer): Integer; stdcall;
    CreatePen: function(color: Cardinal; width: Single; units: TUnit; out pen: Integer): Integer; stdcall;
    DeletePen: function(pen: Integer): Integer; stdcall;
    Flush: function(graphics: Integer; intention: Integer=0): integer; stdcall;
    SetSmoothingMode: function(graphics: integer; mode: TSmoothingMode): integer; stdcall;
    SetTextRenderingHint: function(graphics: integer; mode: TTextRenderingHint): integer; stdcall;
    SetPenBrushFill: function(Pen, Brush: Integer): Integer; stdcall;
    SetPenColor: function(Pen: Integer; Color: Cardinal): Integer; stdcall;
    SetPenWidth: function(Pen: Integer; Width: Single): Integer; stdcall;
    DeleteBrush: function(brush: Integer): Integer; stdcall;
    CreateSolidFill: function(color: Cardinal; var brush: Integer): Integer; stdcall;
    FillRectangle: function(graphics, brush, x, y, width, height: Integer): Integer; stdcall;
    FillEllipse: function(graphics, brush, x, y, width, height: Integer): Integer; stdcall;
    DrawEllipse: function(graphics, pen, x, y, width, height: Integer): Integer; stdcall;
    DrawCurve: function(graphics, pen: Integer; Points: Pointer; Count: Integer): Integer; stdcall;
    GraphicsClear: function(Graphics: Integer; Color: Cardinal): Integer; stdcall;
    SetPageUnit: function(Graphics: Integer; units: TUnit): Integer; stdcall;
    DrawRectangle: function(Graphics, Pen, X, Y, Width, Height: Integer): Integer; stdcall;
    SetPenDashStyle: function(Pen: Integer; dashStyle: Integer): Integer; stdcall;
    DrawPolygon: function(graphics, pen: Integer; points: pointer; count: integer): integer; stdcall;
    FillPolygon: function(graphics, brush: Integer; points: pointer; count: Integer; fillMode: TFillMode): integer; stdcall;
    SetWorldTransform: function(graphics, matrix: Integer): Integer; stdcall;
    GetWorldTransform: function(graphics, matrix: Integer): Integer; stdcall;
    CreateMatrix: function(out matrix: integer): Integer; stdcall;
    CreateMatrix2: function(m11,m12,m21,m22,dx,dy: Single; out matrix: integer): Integer; stdcall;
    DeleteMatrix: function(matrix: integer): Integer; stdcall;
    SetMatrixElements: function(matrix: integer; m11,m12,m21,m22,dx,dy: Single): Integer; stdcall;
    MultiplyMatrix: function(matrix, matrix2: Integer; order: Integer=0): Integer; stdcall;
    ScaleMatrix: function(matrix: integer; scaleX, scaleY: Single; order: integer=0): Integer; stdcall;
    TranslateMatrix: function(matrix: integer; offsetX, offsetY: Single; order: integer=0): Integer; stdcall;
    DrawLines: function(Graphics, Pen: Integer; Points: Pointer; Count: Integer): Integer; stdcall;
    RecordMetafile: function (DC: HDC; emfType: TEmfType; frameRect: PGdipRect;
      frameUnit: TUnit; description: PWideChar; var out_metafile: integer): Integer; stdcall;
    RecordMetafileStream: function (strm: IStream; DC: HDC; emfType: TEmfType; const frameRect: TGdipRect;
      frameUnit: TUnit; description: PWideChar; var out_metafile: integer): Integer; stdcall;
    PlayRecord: function(metafile: integer; RecType, flags, RecSize: cardinal; Rec: Pointer): Integer; stdcall;
    EnumerateMetaFile: function(graphics, metafile: integer; Dest: PGdipRect;
      callback, data: pointer; imageAttributes: integer=0): Integer; stdcall;
    ResetWorldTransform: function(graphics: integer): integer; stdcall;
    RotateTransform: function(graphics: Integer; angle: Single; order: Integer=0): Integer; stdcall;
    TranslateTransform: function(graphics: integer; dx,dy: Single; order: integer=0): integer; stdcall;
    CreateFromImage: function(image: Integer; out graphics: integer): integer; stdcall;
    CreateFontFrom: function(aHDC: HDC; out font: integer): integer; stdcall;
    DeleteFont: function(font: integer): integer; stdcall;
    CreateFontFromLogfont: function(hdc: HDC; logfont: PLOGFONTW; out font: integer): integer; stdcall;
    DrawString: function(graphics: integer; text: PWideChar; length, font: integer;
      Dest: PGdipRectF; format, brush: integer): integer; stdcall;
    MeasureString: function(graphics: Integer; text: PWideChar; length, font: integer;
      Dest: PGdipRectF; format: integer; bound: PGdipRectF;
      codepointsFitted, linesFilled: PInteger): integer; stdcall;
    DrawDriverString: function(graphics: integer; text: PWideChar;
      length, font, brush: integer; positions: PGdipPointFArray; flag, matrix: integer): integer; stdcall;
    CreatePath: function(brushmode: TFillMode; var path: integer): integer; stdcall;
    DeletePath: function(path: integer): integer; stdcall;
    DrawPath: function(graphics, pen, path: integer): integer; stdcall;
    FillPath: function(graphics, brush, path: integer): integer; stdcall;
    AddPathLine: function(path, X1,Y1,X2,Y2: integer): integer; stdcall;
    AddPathLines: function(path: integer; Points: pointer; Count: integer): integer; stdcall;
    AddPathArc: function(path, X,Y,width,height: Integer; StartAndle, SweepAngle: single): integer; stdcall;
    AddPathCurve: function(path: integer; Points: pointer; Count: integer): integer; stdcall;
    AddPathClosedCurve: function(): integer; stdcall;
    AddPathEllipse: function(path, X,Y,width,height: Integer): integer; stdcall;
    AddPathPolygon: function(path: integer; Points: pointer; Count: integer): integer; stdcall;
    AddPathRectangle: function(path, X,Y,width,height: Integer): integer; stdcall;
    ClosePath: function(path: integer): integer; stdcall;
    DrawArc: function(graphics, pen, X,Y,width,height: Integer; StartAndle, SweepAngle: single): integer; stdcall;
    DrawBezier: function(graphics, pen, X1,Y1,X2,Y2,X3,Y3,X4,Y4: Integer): integer; stdcall;
    DrawPie: function(X,Y,width,height: Integer; StartAndle, SweepAngle: single): integer; stdcall;
    class procedure LoadImageFromFile(ACanvas: TCanvas; ARect: TRect; AFileName: string; Align: TAlignment = taCenter); overload;
    class procedure LoadImageFromFile(ABitmap: TBitmap; AFileName: string); overload;
    class procedure LoadImageFromFile(ABitmap: TBitmap; ARect: TRect; AFileName: string; Align: TAlignment = taCenter); overload;
    class procedure LoadImageFromResource(ABitmap: TBitmap; ARect: TRect; AResName, AResType: string; Align: TAlignment = taCenter); overload;
    class procedure LoadImageFromFile(AImage: TImage; AFileName: string; Align: TAlignment = taCenter); overload;
  end;

var
  XPGDIP: TXPGDI absolute Gdip;

implementation

class procedure TXPGDI.LoadImageFromFile(ACanvas: TCanvas; ARect: TRect; AFileName: string; Align: TAlignment);
var
  w, h, lw, lh: Integer;
  mf: TMetaFile;
  pic: TSynPicture;
  ext: string;
begin
  lw := ARect.Right - ARect.Left;
  lh := ARect.Bottom - ARect.Top;
  ext := UpperCase(ExtractFileExt(AFileName));
  if (ext = '.WMF') or (ext = '.EMF') then
  begin
    mf := TMetaFile.Create;
    try
      mf.LoadFromFile(AFileName);
      if (lw = 0) or (lh = 0) then
      begin
        lw := mf.Width;
        lh := mf.Height;
      end;
      w := mf.Width *lh div mf.Height;
      if w > lw then
      begin
        w := lw;
        h := mf.Height * lw div mf.Width;
      end
      else h := lh;
      if Align = taRightJustify then
        ARect.Left := ARect.Left + lw - w
      else if Align = taCenter then
        ARect.Left := ARect.Left + (lw - w) div 2
      else ARect.Left := ARect.Left;
      ARect.Top := ARect.Top + (lh - h) div 2;
      ARect.Right := ARect.Left + w - 1;
      ARect.Bottom := ARect.Top + h - 1;
      Gdip.DrawAntiAliased(mf, ACanvas.Handle, ARect);
    finally
      mf.Free;
    end;
  end
  else
  begin
    pic := TSynPicture.Create;
    try
      pic.LoadFromFile(AFileName);
      if (lw = 0) or (lh = 0) then
      begin
        lw := pic.Width;
        lh := pic.Height;
      end;
      w := pic.Width * lh div pic.Height;
      if w > lw then
      begin
        w := lw;
        h := pic.Height * lw div pic.Width;
      end
      else h := lh;
      if Align = taRightJustify then
        ARect.Left := ARect.Left + lw - w
      else if Align = taCenter then
        ARect.Left := ARect.Left + (lw - w) div 2
      else ARect.Left := ARect.Left;
      ARect.Top := ARect.Top + (lh - h) div 2;
      ARect.Right := ARect.Left + w;
      ARect.Bottom := ARect.Top + h;
      pic.Draw(ACanvas, ARect);
    finally
      pic.Free;
    end;
  end;
end;

class procedure TXPGDI.LoadImageFromFile(ABitmap: TBitmap; AFileName: string);
begin
  LoadImageFromFile(ABitmap, Rect(0, 0, 0, 0), AFileName, taCenter);
end;

class procedure TXPGDI.LoadImageFromFile(ABitmap: TBitmap; ARect: TRect; AFileName: string; Align: TAlignment);
var
  w, h, lw, lh: Integer;
  mf: TMetaFile;
  pic: TSynPicture;
  ext: string;
begin
  lw := ARect.Right - ARect.Left;
  lh := ARect.Bottom - ARect.Top;
  ext := UpperCase(ExtractFileExt(AFileName));
  if (ext = '.WMF') or (ext = '.EMF') then
  begin
    mf := TMetaFile.Create;
    try
      mf.LoadFromFile(AFileName);
      if (lw = 0) or (lh = 0) then
      begin
        lw := mf.Width;
        lh := mf.Height;
      end;
      w := mf.Width *lh div mf.Height;
      if w > lw then
      begin
        w := lw;
        h := mf.Height * lw div mf.Width;
      end
      else h := lh;
      if Align = taRightJustify then
        ARect.Left := ARect.Left + lw - w
      else if Align = taCenter then
        ARect.Left := ARect.Left + (lw - w) div 2
      else ARect.Left := ARect.Left;
      ARect.Top := ARect.Top + (lh - h) div 2;
      ARect.Right := ARect.Left + w - 1;
      ARect.Bottom := ARect.Top + h - 1;
      ABitmap.SetSize(lw, lh);
      Gdip.DrawAntiAliased(mf, ABitmap.Canvas.Handle, ARect);
    finally
      mf.Free;
    end;
  end
  else
  begin
    pic := TSynPicture.Create;
    try
      pic.LoadFromFile(AFileName);
      if (lw = 0) or (lh = 0) then
      begin
        lw := pic.Width;
        lh := pic.Height;
      end;
      if pic.Height > 0 then
        w := pic.Width * lh div pic.Height
      else w := 0;
      if w > lw then
      begin
        w := lw;
        if pic.Width > 0 then
          h := pic.Height * lw div pic.Width
        else h := 0;
      end
      else h := lh;
      if Align = taRightJustify then
        ARect.Left := ARect.Left + lw - w
      else if Align = taCenter then
        ARect.Left := ARect.Left + (lw - w) div 2
      else ARect.Left := ARect.Left;
      ARect.Top := ARect.Top + (lh - h) div 2;
      ARect.Right := ARect.Left + w;
      ARect.Bottom := ARect.Top + h;
      ABitmap.SetSize(lw, lh);
      pic.Draw(ABitmap.Canvas, ARect);
    finally
      pic.Free;
    end;
  end;
end;

class procedure TXPGDI.LoadImageFromResource(ABitmap: TBitmap; ARect: TRect; AResName, AResType: string; Align: TAlignment);
var
  AStream: TResourceStream;
  w, h, lw, lh: Integer;
  mf: TMetaFile;
  pic: TSynPicture;
begin
  lw := ARect.Right - ARect.Left;
  lh := ARect.Bottom - ARect.Top;
  AStream := TResourceStream.Create(hInstance, PChar(AResName), PChar(AResType));
  try
    if (AResType = 'WMF') or (AResType = 'EMF') then
    begin
      mf := TMetaFile.Create;
      try
        mf.LoadFromStream(AStream);
        if (lw = 0) or (lh = 0) then
        begin
          lw := mf.Width;
          lh := mf.Height;
        end;
        w := mf.Width *lh div mf.Height;
        if w > lw then
        begin
          w := lw;
          h := mf.Height * lw div mf.Width;
        end
        else h := lh;
        if Align = taRightJustify then
          ARect.Left := ARect.Left + lw - w
        else if Align = taCenter then
          ARect.Left := ARect.Left + (lw - w) div 2
        else ARect.Left := ARect.Left;
        ARect.Top := ARect.Top + (lh - h) div 2;
        ARect.Right := ARect.Left + w - 1;
        ARect.Bottom := ARect.Top + h - 1;
//        ABitmap.SetSize(lw, lh);
        Gdip.DrawAntiAliased(mf, ABitmap.Canvas.Handle, ARect);
      finally
        mf.Free;
      end;
    end
    else
    begin
      pic := TSynPicture.Create;
      try
        pic.LoadFromStream(AStream);
        if (lw = 0) or (lh = 0) then
        begin
          lw := pic.Width;
          lh := pic.Height;
        end;
        if pic.Height > 0 then
          w := pic.Width * lh div pic.Height
        else w := 0;
        if w > lw then
        begin
          w := lw;
          if pic.Width > 0 then
            h := pic.Height * lw div pic.Width
          else h := 0;
        end
        else h := lh;
        if Align = taRightJustify then
          ARect.Left := ARect.Left + lw - w
        else if Align = taCenter then
          ARect.Left := ARect.Left + (lw - w) div 2
        else ARect.Left := ARect.Left;
        ARect.Top := ARect.Top + (lh - h) div 2;
        ARect.Right := ARect.Left + w;
        ARect.Bottom := ARect.Top + h;
//        ABitmap.SetSize(lw, lh);
        pic.Draw(ABitmap.Canvas, ARect);
      finally
        pic.Free;
      end;
    end;
  finally
    AStream.Free;
  end;
end;

class procedure TXPGDI.LoadImageFromFile(AImage: TImage; AFileName: string; Align: TAlignment);
var
  w, h, lw, lh: Integer;
  mf: TMetaFile;
  pic: TSynPicture;
  ext: string;
  R: TRect;
begin
  lw := AImage.Width;
  lh := AImage.Height;
  AImage.Picture.Bitmap.PixelFormat := pf24bit;
  AImage.Picture.Bitmap.SetSize(0, 0);
  ext := UpperCase(ExtractFileExt(AFileName));
  if (ext = '.WMF') or (ext = '.EMF') then
  begin
    mf := TMetaFile.Create;
    try
      mf.LoadFromFile(AFileName);
      w := mf.Width *lh div mf.Height;
      if w > lw then
      begin
        w := lw;
        h := mf.Height * lw div mf.Width;
      end
      else h := lh;
      AImage.Picture.Bitmap.SetSize(lw, lh);
      if Align = taRightJustify then
        R.Left := lw - w
      else if Align = taCenter then
        R.Left := (lw - w) div 2
      else R.Left := 0;
      R.Right := R.Left + w - 1;
      R.Top := (lh - h) div 2;
      R.Bottom := R.Top + h - 1;
      Gdip.DrawAntiAliased(mf, AImage.Picture.Bitmap.Canvas.Handle, R);
    finally
      mf.Free;
    end;
  end
  else
  begin
    pic := TSynPicture.Create;
    try
      pic.LoadFromFile(AFileName);
      w := pic.Width * lh div pic.Height;
      if w > lw then
      begin
        w := lw;
        h := pic.Height * lw div pic.Width;
      end
      else h := lh;
      AImage.Picture.Bitmap.SetSize(lw, lh);
      R.Left := (lw - w) div 2;
      R.Top := (lh - h) div 2;
      R.Right := R.Left + w;
      R.Bottom := R.Top + h;
      pic.Draw(AImage.Picture.Bitmap.Canvas, R);
    finally
      pic.Free;
    end;
  end;
end;

initialization
  XPGDIP := TXPGDI.Create;

end.
