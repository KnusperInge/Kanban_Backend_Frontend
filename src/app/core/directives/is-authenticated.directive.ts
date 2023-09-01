import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Directive({
  selector: '[isAuthenticated]',
})
export class IsAuthenticatedDirective {
  private _isVisible: boolean = false;

  constructor(
    public as: AuthService,
    public templateRef: TemplateRef<any>,
    public viewContainer: ViewContainerRef
  ) {
    const token = localStorage.getItem('usertoken');
    as.currentUser.subscribe((res) => {
      if (res || token) {
        this.show();
      } else {
        this.hide();
      }
    });
  }

  public hide() {
    if (this._isVisible) {
      this.templateRef.elementRef.nativeElement.nextElementSibling.style.height =
        '100%';
      this.viewContainer.clear();
      this._isVisible = false;
    }
  }
  public show() {
    if (!this._isVisible) {
      this._isVisible = true;

      this.viewContainer.createEmbeddedView(this.templateRef);
      this.templateRef.elementRef.nativeElement.nextElementSibling.style.height =
        'calc(100% - 64px)';
      console.log('Show me ');
    }
  }
}
