unit XPFrameRate;

interface

uses
  SysUtils;

type
  TXPFrameRate = class
  private
    FFrameTime: TDateTime;
    FFrameCount: Integer;
    FFrameRate: Double;
  public
    property FrameRate: Double read FFrameRate;
    constructor Create;
    destructor Destroy; override;
    function Update: Double;
  end;

implementation

constructor TXPFrameRate.Create;
begin
  FFrameCount := 0;
  FFrameRate := 0.0;
  FFrameTime := Now * 24 * 60 * 60;
end;

destructor TXPFrameRate.Destroy;
begin
  inherited Destroy;
end;

function TXPFrameRate.Update: Double;
var
  ntime: TDateTime;
begin
  Inc(FFrameCount);
  ntime := Now * 24 * 60 * 60;
  if ntime - FFrameTime > 1 then
  begin
    FFrameRate := (FFrameRate + FFrameCount / (ntime - FFrameTime)) / 2;
    FFrameCount := 0;
    FFrameTime := ntime;
  end;
  Result := FFrameRate;
end;

end.
