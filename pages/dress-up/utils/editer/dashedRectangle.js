// import {DashLine} from 'pixi-dashed-line'
export class DashedRectangle {
  constructor(PIXI, editableTarget) {
    this.editableTarget = editableTarget;
    this.PIXI = PIXI;
  }

  create() {
    // 获取可编辑目标的边界矩形
    // const rect = this.editableTarget.getBounds();
    const rect = this.editableTarget.getGlobalPosition()
    const { x, y } = rect;
    const width= this.editableTarget.width
    const height=this.editableTarget.height
    console.log("是中心还是什么",x,y)

    // const { x, y, width, height } = rect;
    const line = new this.PIXI.Graphics();
    this.drawDashedLine(line,x,y,x+width,y,[4,3],2,0x000000)
    this.drawDashedLine(line,x+width,y,x+width,y+height,[4,3],2,0x000000)
    this.drawDashedLine(line,x+width,y+height,x,y+height,[4,3],2,0x000000)
    this.drawDashedLine(line,x,y+height,x,y,[4,3],2,0x000000)
    line.name = 'dashline';
    return line;
  }

  drawDashedLine(graphics, x1, y1, x2, y2, dash = [4, 3], width = 1, color = 0x000000, alpha = 1) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
  
    let currentDistance = 0;
    let draw = true;
    let dashIndex = 0;
  
    while (currentDistance < distance) {
      let segmentLength = dash[dashIndex % dash.length];
      const nextDistance = currentDistance + segmentLength;
  
      if (nextDistance > distance) {
        segmentLength = distance - currentDistance;
      }
  
      const segmentX = x1 + Math.cos(angle) * currentDistance;
      const segmentY = y1 + Math.sin(angle) * currentDistance;
  
      if (draw) {
        graphics.lineStyle(width, color, alpha);
        graphics.moveTo(segmentX, segmentY);
        graphics.lineTo(
          x1 + Math.cos(angle) * nextDistance,
          y1 + Math.sin(angle) * nextDistance
        );
      } else {
        graphics.moveTo(
          x1 + Math.cos(angle) * nextDistance,
          y1 + Math.sin(angle) * nextDistance
        );
      }
  
      currentDistance = nextDistance;
      draw = !draw;
      dashIndex++;
    }
  }
}