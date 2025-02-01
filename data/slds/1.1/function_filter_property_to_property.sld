<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<StyledLayerDescriptor version="1.1.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
    xmlns="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:se="http://www.opengis.net/se">
    <NamedLayer>
        <se:Name>Function Property to Property</se:Name>
        <UserStyle>
            <se:Name>Function Property to Property</se:Name>
            <se:FeatureTypeStyle>
                <se:Rule>
                    <se:Name>Property Comparison Rule</se:Name>
                    <Filter xmlns="http://www.opengis.net/ogc">
                        <And>
                            <PropertyIsEqualTo>
                                <PropertyName>posledni_hodnota</PropertyName>
                                <PropertyName>posledni_hodnota_sekundarni</PropertyName>
                            </PropertyIsEqualTo>
                            <PropertyIsGreaterThan>
                                <PropertyName>value1</PropertyName>
                                <PropertyName>value2</PropertyName>
                            </PropertyIsGreaterThan>
                            <PropertyIsLessThan>
                                <PropertyName>count1</PropertyName>
                                <PropertyName>count2</PropertyName>
                            </PropertyIsLessThan>
                            <PropertyIsGreaterThanOrEqualTo>
                                <PropertyName>threshold1</PropertyName>
                                <PropertyName>threshold2</PropertyName>
                            </PropertyIsGreaterThanOrEqualTo>
                            <Function name="lessThanOrEqualTo">
                                <PropertyName>posledni_hodnota</PropertyName>
                                <PropertyName>spa1h</PropertyName>
                            </Function>
                            <PropertyIsNotEqualTo>
                                <PropertyName>status</PropertyName>
                                <Literal>NULL</Literal>
                            </PropertyIsNotEqualTo>
                        </And>
                    </Filter>
                    <se:PointSymbolizer>
                        <se:Graphic>
                            <se:Mark>
                                <se:WellKnownName>square</se:WellKnownName>
                                <se:Fill>
                                    <se:SvgParameter name="fill">#FF0000</se:SvgParameter>
                                </se:Fill>
                                <se:Stroke>
                                    <se:SvgParameter name="stroke">#000000</se:SvgParameter>
                                    <se:SvgParameter name="stroke-width">1</se:SvgParameter>
                                </se:Stroke>
                            </se:Mark>
                            <se:Size>5</se:Size>
                        </se:Graphic>
                    </se:PointSymbolizer>
                </se:Rule>
            </se:FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
</StyledLayerDescriptor> 