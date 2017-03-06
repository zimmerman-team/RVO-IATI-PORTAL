for ri in ResultIndicator.objects.filter(resultindicatortitle__narratives__content="Number of full-time (equivalent) direct jobs supported - Female"):
    # if result does not have "... - Male" indicator, add. 
    # print ri.result.activity.id
    total = ResultIndicator.objects.get(
        result__activity__id=ri.result.activity.id, 
        resultindicatortitle__narratives__content="Number of full-time (equivalent) direct jobs supported - Total")
    #
    total_actual_value = 0
    for p in total.resultindicatorperiod_set.all():
        # TODO: chage to most recent period
        if p.actual:
            total_actual_value += p.actual
    #
    if total_actual_value == 0:
        continue
    #
    female_actual_value = 0
    female_rip = None
    for p in ri.resultindicatorperiod_set.all():
        # TODO: chage to most recent period
        female_rip = p
        if p.actual:
            female_actual_value += p.actual
    #
    male_value = total_actual_value - female_actual_value
    #
    if male_value < 1:
        continue
    #
    # check if male indicator already exists, if so and not same value, update, else add
    male = ResultIndicator.objects.get(
        result__activity__id=ri.result.activity.id, 
        resultindicatortitle__narratives__content="Number of full-time (equivalent) direct jobs supported - Male")
    male_actual_value = 0
    for p in male.resultindicatorperiod_set.all():
        # TODO: chage to most recent period
        if p.actual:
            total_actual_value += p.actual
    #
    if total_actual_value == 0:
        continue







    ri_new = ResultIndicator(
        result=ri.result,
        measure=ri.measure,
    )
    ri_new.save()
    #
    print ri_new
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
    # add ResultIndicatorPeriod
    rip = ResultIndicatorPeriod(
        result_indicator=ri_new,
        period_start=female_rip.period_start,
        period_end=female_rip.period_end,
        target=None,
        actual=male_value
    )
    rip.save()