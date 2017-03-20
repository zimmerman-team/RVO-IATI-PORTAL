from django.core.exceptions import ObjectDoesNotExist

for ri in ResultIndicator.objects.filter(resultindicatortitle__narratives__content="Number of full-time (equivalent) direct jobs supported - Female"):
    """
    INIT PART
    """
    # if result does not have "... - Male" indicator, add. 
    # print ri.result.activity.id
    try:
        total_count = ResultIndicator.objects.filter(
            result__activity__id=ri.result.activity.id, 
            resultindicatortitle__narratives__content="Number of full-time (equivalent) direct jobs supported - Total").count()
        if total_count > 1:
            print 'duplicate totals for {}'.format(ri.result.activity.iati_identifier)
            continue
        else:
            total = ResultIndicator.objects.get(
                result__activity__id=ri.result.activity.id, 
                resultindicatortitle__narratives__content="Number of full-time (equivalent) direct jobs supported - Total")
    except ObjectDoesNotExist:
        print 'total does not exist for {}'.format(ri.result.activity.iati_identifier)
        continue
    #
    #
    #
    try:
        total_count = ResultIndicator.objects.filter(
            result__activity__id=ri.result.activity.id, 
            resultindicatortitle__narratives__content="Number of full-time (equivalent) direct jobs supported - Male").count()
        if total_count > 1:
            print 'duplicate totals for {}'.format(ri.result.activity.iati_identifier)
            continue
        else:
            male = ResultIndicator.objects.get(
                result__activity__id=ri.result.activity.id, 
                resultindicatortitle__narratives__content="Number of full-time (equivalent) direct jobs supported - Male")
    except ObjectDoesNotExist:
        male = None
    #
    #
    #
    years = [2015, 2016]
    #
    for curyear in years:
        #
        total_actual_value = 0
        female_actual_value = 0
        male_actual_value = 0
        female_rip = None
        male_rip = None
        #
        #
        for p in total.resultindicatorperiod_set.filter(period_end__year=years[curyear]):
            if p.actual:
                total_actual_value = p.actual
        #
        if total_actual_value == 0:
            continue
        #
        #
        for p in ri.resultindicatorperiod_set.filter(period_end__year=years[curyear]):
            female_rip = p
            if p.actual:
                female_actual_value = p.actual
        #
        #
        male_value = total_actual_value - female_actual_value
        if male_value < 1:
            print 'male value below zero, should not happen too often'
        #
        # if male period already exists for this year, then update
        if male:
            if male.resultindicatorperiod_set.get(period_end__year=years[curyear]).exists():
                male.resultindicatorperiod_set.get(period_end__year=years[curyear]).update(actual=male_value)
        else:
            # create new resultindicator
            ri_new = ResultIndicator(
                result=ri.result,
                measure=ri.measure,
            )
            ri_new.save()
            #
            ri_new_title = ResultIndicatorTitle(
                result_indicator=ri_new,
                primary_name="Number of full-time (equivalent) direct jobs supported - Male"
            )
            ri_new_title.save()
            #
            language = Language.objects.get(pk='en')
            narrative = Narrative(
                language=language,
                content="Number of full-time (equivalent) direct jobs supported - Male",
                related_object=ri_new_title,
                activity=ri.result.activity
            )
            narrative.save()
            #
            rip = ResultIndicatorPeriod(
                result_indicator=ri_new,
                period_start=female_rip.period_start,
                period_end=female_rip.period_end,
                target=None,
                actual=male_value
            )
            rip.save()