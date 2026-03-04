unit XPTime;

interface

uses
  SysUtils;

type
  TXPTime = class
  private
    FCount: Extended;
    FAmount, FRemain: Integer;
    procedure FWriteAmount(AAmount: Integer);
  public
    Time: Extended;
    Duration: Int64;
    property AMount: Integer read FAmount write FWriteAmount;
    constructor Create(ADuration: Int64 = 1000; AAmount: Integer = 1);
    procedure Clear;
    procedure Start;
    function CountDown: Boolean;
    function Count(Refresh: Boolean = True): Integer;
    function FloatCount(Refresh: Boolean = True): Extended;
    function Interval(Refresh: Boolean = True): Boolean;
    function OneCount(Refresh: Boolean = True): Boolean;
    procedure SetPeriod(ADuration: Int64 = 1000; AAmount: Integer = 1);
  end;

implementation

constructor TXPTime.Create(ADuration: Int64 = 1000; AAmount: Integer = 1);
begin
  SetPeriod(ADuration, AAmount);
  Clear;
end;

procedure TXPTime.Clear;
begin
  Time := 0.0;
  FCount := 0.0;
  FRemain := FAmount;
end;

procedure TXPTime.FWriteAmount(AAmount: Integer);
begin
  FAmount := AAmount;
  FRemain := AAmount;
end;

procedure TXPTime.Start;
begin
  Time := Now;
  FCount := 0.0;
  FRemain := FAmount;
end;

function TXPTime.FloatCount(Refresh: Boolean = True): Extended;
var
  ntime: Extended;
begin
  ntime := Now;
  Result := FCount + (ntime - Time) * 24 * 60 * 60 * 1000 / Duration;
  FCount := 0.0;
  if Refresh then Time := ntime;
end;

function TXPTime.CountDown: Boolean;
var
  ntime: Extended;
begin
  Result := False;
  ntime := Now;
  if (ntime - Time) * 24 * 60 * 60 * 1000 >= Duration then
  begin
    Time := ntime;
    Dec(FRemain);
    if FRemain < 0 then
    begin
      FRemain := FAmount;
      Result := True;
    end;
  end;
end;

function TXPTime.Count(Refresh: Boolean = True): Integer;
var
  fc: Extended;
begin
  fc := FloatCount(Refresh);
  Result := Round(fc);
  if (Refresh) then FCount := fc - Result
end;

function TXPTime.Interval(Refresh: Boolean = True): Boolean;
begin
  Result := Count(Refresh) >= 1;
end;

function TXPTime.OneCount(Refresh: Boolean = True): Boolean;
var
  fc: Extended;
begin
  fc := FloatCount(Refresh);
  if fc >= 1.0 then
  begin
    fc := fc - 1.0;
    Result := True;
  end
  else Result := False;
  if Refresh then FCount := fc;
end;

procedure TXPTime.SetPeriod(ADuration: Int64 = 1000; AAmount: Integer = 1);
begin
  Duration := ADuration;
  FAMount := AAmount;
  FRemain := AAmount;
end;

end.
