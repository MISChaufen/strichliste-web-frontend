import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import {UserInterface} from '../../user.interface';
import {UserStore} from '../../user.store';
import {AlertsService} from '../../../shared/alerts/alerts.service';
import {AlertModel} from '../../../shared/alerts/alert.model';


@Component({
  selector: 'tally-user-transaction-button-set',
  templateUrl: './user-transaction-button-set.component.html',
  styleUrls: ['./user-transaction-button-set.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserTransactionButtonSetComponent implements OnInit {
  @Input() user:UserInterface;
  @Input() positive:boolean;

  values: number[];

  constructor(public store:UserStore,
              private alerts:AlertsService) {

    this.values = [
      0.5,
      1,
      2,
      5
    ];
  }

  ngOnInit() {}

  addTransaction(value:string) {
    this.store.addUserTransaction(value).then(null, err => {
      this.alerts.add(new AlertModel('danger', 'Error while adding transaction! :('));
    });
  }
}
