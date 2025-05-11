import { AuditService } from '../../../src/enterprise/audit/audit-service';

describe('AuditService', () => {
  it('logs and retrieves audit logs', () => {
    const audit = new AuditService();
    audit.log('user1', 'create', { foo: 'bar' });
    audit.log('user2', 'delete', { bar: 'baz' });
    const logs1 = audit.getLogs('user1');
    const logs2 = audit.getLogs('user2');
    expect(logs1.length).toBe(1);
    expect(logs1[0].action).toBe('create');
    expect(logs2.length).toBe(1);
    expect(logs2[0].action).toBe('delete');
  });
}); 