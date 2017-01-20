

import csv

with open('rvo.csv', 'wb') as csvfile:
    fieldnames = [
        'programme_id', 
        'programme_name', 
        'activity_id', 
        'result_id', 
        'result_type',
        'result_type_name',
        'result_aggregation_status',
        'result_title', 
        'result_description',
        'result_indicator_id', 
        'result_indicator_title',
        'result_indicator_description',
        'result_baseline_year',
        'result_baseline_value',
        'result_indicator_period_id', 
        'result_period_start_date',
        'result_period_end_date',
        'result_period_target',
        'result_period_target_comment',
        'result_period_actual',
        'result_period_actual_comment']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    for a in Activity.objects.filter(hierarchy=2,reporting_organisations__ref='NL-KVK-27378529'):
        for r in a.result_set.all():
            result_type = r.type.code
            result_type_name = r.type.name
            result_aggregation_status = int(r.aggregation_status)
            for ri in r.resultindicator_set.all():
                result_title = r.resulttitle.narratives.all()[0].content;
                result_title = unicode(result_title).encode("utf-8")
                try: 
                    result_description = ri.resultdescription.narratives.all()[0].content
                    result_description = unicode(result_description).encode("utf-8")
                except Exception:
                    result_description = ''
                for rip in ri.resultindicatorperiod_set.all():
                    if ri.resultindicatortitle.narratives.all().count() > 0:
                        result_indicator_title = ri.resultindicatortitle.narratives.all()[0].content
                        result_indicator_title = unicode(result_indicator_title).encode("utf-8")
                    else:
                        result_indicator_title = ''
                    try: 
                        result_indicator_description = ri.resultindicatordescription.narratives.all()[0].content
                        result_indicator_description = unicode(result_indicator_description).encode("utf-8")
                    except Exception:
                        result_indicator_description = ''
                    programme = a.relatedactivity_set.all()[0].ref_activity
                    writer.writerow({
                        'programme_id':programme.id, 
                        'programme_name':programme.title.narratives.all()[0].content, 
                        'activity_id': a.id, 
                        'result_id': r.id, 
                        'result_type': result_type,
                        'result_type_name': result_type_name,
                        'result_aggregation_status': result_aggregation_status,
                        'result_title': result_title,
                        'result_description': result_description,
                        'result_indicator_id': ri.id,
                        'result_indicator_title': result_indicator_title,
                        'result_indicator_description': result_indicator_description,
                        'result_baseline_year': ri.baseline_year,
                        'result_baseline_value': ri.baseline_value,
                        'result_indicator_period_id': rip.id,
                        'result_period_start_date': rip.period_start,
                        'result_period_end_date': rip.period_end,
                        'result_period_target': rip.target,
                        'result_period_target_comment': '',
                        'result_period_actual': rip.actual,
                        'result_period_actual_comment': '',
                    })
                    for i in range(7):
                        writer.writerow({
                            'programme_id': '', 
                            'programme_name': '', 
                            'activity_id': a.id, 
                            'result_id': '', 
                            'result_type': '',
                            'result_type_name': '',
                            'result_aggregation_status': '',
                            'result_title': '',
                            'result_description': '',
                            'result_indicator_id': '',
                            'result_indicator_title': '',
                            'result_indicator_description': '',
                            'result_baseline_year': '',
                            'result_baseline_value': '',
                            'result_indicator_period_id': '',
                            'result_period_start_date': '',
                            'result_period_end_date': '',
                            'result_period_target': '',
                            'result_period_target_comment': '',
                            'result_period_actual': '',
                            'result_period_actual_comment': '',
                        })